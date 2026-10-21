/**
 * Touch & Click Heatmap / UX Interaction Analytics Tracker
 * Ghi nhận hành vi điểm chạm người dùng (Click, Touch, Scroll Depth, Rage & Dead Clicks, Visitor Tracking)
 * Tích hợp nguồn truy cập thực tế (Zalo Campaign, Mobile/Desktop, Unique Visitors)
 */

export interface HeatmapEvent {
  id: string;
  type: "click" | "tap" | "rage_click" | "dead_click" | "scroll_milestone" | "pageview";
  timestamp: number;
  sessionId: string;
  visitorId: string;
  pageUrl: string;
  deviceType: "desktop" | "tablet" | "mobile";
  viewportWidth: number;
  viewportHeight: number;
  documentHeight: number;
  xNorm: number;
  yNorm: number;
  docX: number;
  docY: number;
  elementId?: string;
  elementType?: string;
  elementText?: string;
  scrollDepth?: number;
  isZalo?: boolean;
  utmSource?: string;
  isNewVisitor?: boolean;
  isNewSession?: boolean;
}

export interface ElementDetailStats {
  count: number;
  name: string;
  mobileCount: number;
  desktopCount: number;
  zaloCount: number;
  rageCount: number;
  deadCount: number;
  lastInteracted?: number;
}

export interface HeatmapStore {
  events: HeatmapEvent[];
  summary: {
    totalClicks: number;
    totalTaps: number;
    totalRageClicks: number;
    totalDeadClicks: number;
    totalSessions: number;
    totalVisitors: number;
    zaloVisitors: number;
    activeVisitors: number;
    lastActiveTimestamp?: number;
    scrollStats: {
      "25": number;
      "50": number;
      "75": number;
      "100": number;
    };
    elementRanking?: Record<string, number>;
    elementBreakdown?: Record<string, ElementDetailStats>;
  };
}

const KVDB_HEATMAP_URL = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/heatmap_data";
const SESSION_STORAGE_KEY = "aurora_heatmap_session_id";
const VISITOR_STORAGE_KEY = "aurora_unique_visitor_id";
const SESSION_TRACKED_KEY = "aurora_session_pageview_tracked";

function getUniqueVisitorId(): { visitorId: string; isNewVisitor: boolean } {
  try {
    let visitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    let isNewVisitor = false;
    if (!visitorId) {
      visitorId = "vis_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
      window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
      isNewVisitor = true;
    }
    return { visitorId, isNewVisitor };
  } catch {
    return { visitorId: "vis_anon", isNewVisitor: false };
  }
}

function getAnonymousSessionId(): { sessionId: string; isNewSession: boolean } {
  try {
    let sessId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    let isNewSession = false;
    if (!sessId) {
      sessId = "sess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessId);
      isNewSession = true;
    }
    return { sessionId, isNewSession };
  } catch {
    return { sessionId: "sess_anon", isNewSession: false };
  }
}

function getDeviceType(): "desktop" | "tablet" | "mobile" {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function isZaloSource(): boolean {
  try {
    const s = window.location.search.toLowerCase();
    const r = document.referrer.toLowerCase();
    return (
      s.includes("zalo") ||
      s.includes("zarsrc=30") ||
      s.includes("utm_source=zalo") ||
      r.includes("zalo")
    );
  } catch {
    return false;
  }
}

export class HeatmapTracker {
  private queue: HeatmapEvent[] = [];
  private flushTimer: number | null = null;
  private visitorInfo = getUniqueVisitorId();
  private sessionInfo = getAnonymousSessionId();
  private scrollMilestones = new Set<number>();
  private recentClicks: { time: number; x: number; y: number }[] = [];
  private isTouchDevice = false;
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    try {
      this.channel = new BroadcastChannel("heatmap-events-sync");
    } catch {}
  }

  public init() {
    if (typeof window === "undefined") return;

    // 1. Ghi nhận lượt truy cập (Pageview / Visit) ngay lập tức
    this.trackInitialVisit();

    // 2. Lắng nghe các điểm chạm & click
    window.addEventListener("pointerdown", this.handlePointerDown, { passive: true });

    // 3. Lắng nghe độ sâu cuộn trang
    window.addEventListener("scroll", this.handleScroll, { passive: true });

    // 4. Lắng nghe đóng tab / ẩn trang để đẩy nốt sự kiện
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("pagehide", () => this.flush(true));

    // Kiểm tra scroll ban đầu
    this.checkScrollMilestones();

    // Định kỳ gửi dữ liệu mỗi 5 giây
    this.flushTimer = window.setInterval(() => this.flush(false), 5000);
  }

  private trackInitialVisit() {
    try {
      const alreadyTracked = window.sessionStorage.getItem(SESSION_TRACKED_KEY);
      const isZalo = isZaloSource();
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source") || (isZalo ? "zalo" : "direct");

      const pvEvent: HeatmapEvent = {
        id: "pv_" + Math.random().toString(36).substring(2, 9),
        type: "pageview",
        timestamp: Date.now(),
        sessionId: this.sessionInfo.sessionId,
        visitorId: this.visitorInfo.visitorId,
        pageUrl: window.location.pathname + window.location.search + window.location.hash,
        deviceType: getDeviceType(),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight || window.innerHeight,
        xNorm: 0.5,
        yNorm: 0.05,
        docX: window.innerWidth / 2,
        docY: 50,
        isZalo,
        utmSource,
        isNewVisitor: this.visitorInfo.isNewVisitor,
        isNewSession: !alreadyTracked || this.sessionInfo.isNewSession,
      };

      window.sessionStorage.setItem(SESSION_TRACKED_KEY, "true");
      this.queue.push(pvEvent);

      // Gửi ngay sau 800ms để ghi nhận visitor counter tức thì
      window.setTimeout(() => this.flush(false), 800);
    } catch (e) {
      console.warn("Could not track visit:", e);
    }
  }

  public destroy() {
    window.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flush(true);
    this.channel?.close();
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    const docWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
    const docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);

    const docX = window.scrollX + event.clientX;
    const docY = window.scrollY + event.clientY;

    const xNorm = Math.min(1, Math.max(0, docX / docWidth));
    const yNorm = Math.min(1, Math.max(0, docY / docHeight));

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target instanceof HTMLInputElement && (target.type === "password" || target.type === "hidden")) {
      return;
    }

    const heatmapEl = target.closest<HTMLElement>("[data-heatmap-id]");
    const interactiveEl = target.closest<HTMLElement>("a, button, input, select, textarea, [role='button'], [tabindex]");

    const elementId = heatmapEl?.dataset.heatmapId || (interactiveEl ? this.generateElementSelector(interactiveEl) : undefined);
    const elementType = interactiveEl ? interactiveEl.tagName.toLowerCase() : target.tagName.toLowerCase();
    const elementText = interactiveEl ? (interactiveEl.getAttribute("aria-label") || interactiveEl.innerText?.substring(0, 30)?.trim()) : undefined;

    const now = Date.now();
    const isTouch = event.pointerType === "touch" || this.isTouchDevice;

    // Phát hiện Rage Click (người dùng bấm dồn dập vào cùng 1 vị trí)
    this.recentClicks = this.recentClicks.filter((c) => now - c.time < 1200);
    this.recentClicks.push({ time: now, x: docX, y: docY });

    let isRageClick = false;
    if (this.recentClicks.length >= 3) {
      const first = this.recentClicks[0];
      const distance = Math.hypot(first.x - docX, first.y - docY);
      if (distance < 30) {
        isRageClick = true;
      }
    }

    // Phát hiện Dead Click (nhấp vào phần tử tĩnh không có phản hồi)
    const isDeadClick = !interactiveEl && !heatmapEl && (target === document.body || target.tagName.toLowerCase() === "div" || target.tagName.toLowerCase() === "section");

    const eventType: HeatmapEvent["type"] = isRageClick
      ? "rage_click"
      : isDeadClick
      ? "dead_click"
      : isTouch
      ? "tap"
      : "click";

    const isZalo = isZaloSource();

    const heatEvent: HeatmapEvent = {
      id: "ev_" + Math.random().toString(36).substring(2, 9),
      type: eventType,
      timestamp: now,
      sessionId: this.sessionInfo.sessionId,
      visitorId: this.visitorInfo.visitorId,
      pageUrl: window.location.pathname + window.location.search + window.location.hash,
      deviceType: getDeviceType(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentHeight: docHeight,
      xNorm,
      yNorm,
      docX,
      docY,
      elementId,
      elementType,
      elementText,
      isZalo,
    };

    this.queue.push(heatEvent);

    if (this.queue.length >= 10) {
      this.flush(false);
    }
  };

  private handleScroll = () => {
    this.checkScrollMilestones();
  };

  private checkScrollMilestones() {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, winHeight);

    const currentScrollDepth = Math.min(100, Math.round(((scrollY + winHeight) / docHeight) * 100));

    const milestones = [25, 50, 75, 100];
    for (const m of milestones) {
      if (currentScrollDepth >= m && !this.scrollMilestones.has(m)) {
        this.scrollMilestones.add(m);

        const isZalo = isZaloSource();
        const milestoneEvent: HeatmapEvent = {
          id: `scroll_${m}_${Date.now()}`,
          type: "scroll_milestone",
          timestamp: Date.now(),
          sessionId: this.sessionInfo.sessionId,
          visitorId: this.visitorInfo.visitorId,
          pageUrl: window.location.pathname + window.location.search + window.location.hash,
          deviceType: getDeviceType(),
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          documentHeight: docHeight,
          xNorm: 0.5,
          yNorm: m / 100,
          docX: window.innerWidth / 2,
          docY: (m / 100) * docHeight,
          scrollDepth: m,
          isZalo,
        };

        this.queue.push(milestoneEvent);
      }
    }
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      this.flush(true);
    }
  };

  private generateElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase();
    const className = typeof el.className === "string" ? el.className.split(" ")[0] : "";
    if (el.id) return `#${el.id}`;
    if (className) return `${tag}.${className}`;
    return tag;
  }

  public async flush(isExiting = false) {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      // 1. Lấy dữ liệu heatmap hiện tại từ KVDB
      const res = await fetch(KVDB_HEATMAP_URL, { cache: "no-store" });
      let store: HeatmapStore = {
        events: [],
        summary: {
          totalClicks: 0,
          totalTaps: 0,
          totalRageClicks: 0,
          totalDeadClicks: 0,
          totalSessions: 1,
          totalVisitors: 1,
          zaloVisitors: 0,
          activeVisitors: 1,
          lastActiveTimestamp: Date.now(),
          scrollStats: { "25": 0, "50": 0, "75": 0, "100": 0 },
          elementRanking: {},
          elementBreakdown: {},
        },
      };

      if (res.ok) {
        try {
          const data = await res.json();
          if (data && Array.isArray(data.events)) {
            store = data;
          }
        } catch {}
      }

      // Giữ tối đa 2000 sự kiện gần nhất
      const mergedEvents = [...store.events, ...eventsToSend].slice(-2000);

      // Cập nhật metrics
      const summary = store.summary || {
        totalClicks: 0,
        totalTaps: 0,
        totalRageClicks: 0,
        totalDeadClicks: 0,
        totalSessions: 1,
        totalVisitors: 1,
        zaloVisitors: 0,
        activeVisitors: 1,
        scrollStats: { "25": 0, "50": 0, "75": 0, "100": 0 },
        elementRanking: {},
        elementBreakdown: {},
      };

      if (!summary.elementRanking) summary.elementRanking = {};
      if (!summary.elementBreakdown) summary.elementBreakdown = {};
      if (!summary.totalVisitors) summary.totalVisitors = 1;
      if (!summary.zaloVisitors) summary.zaloVisitors = 0;

      summary.lastActiveTimestamp = Date.now();

      for (const ev of eventsToSend) {
        if (ev.type === "pageview") {
          if (ev.isNewVisitor) summary.totalVisitors += 1;
          if (ev.isNewSession) summary.totalSessions += 1;
          if (ev.isZalo) summary.zaloVisitors += 1;
        }

        if (ev.type === "click") summary.totalClicks = (summary.totalClicks || 0) + 1;
        if (ev.type === "tap") summary.totalTaps = (summary.totalTaps || 0) + 1;
        if (ev.type === "rage_click") summary.totalRageClicks = (summary.totalRageClicks || 0) + 1;
        if (ev.type === "dead_click") summary.totalDeadClicks = (summary.totalDeadClicks || 0) + 1;

        if (ev.type === "scroll_milestone" && ev.scrollDepth) {
          const depthKey = String(ev.scrollDepth) as "25" | "50" | "75" | "100";
          if (summary.scrollStats[depthKey] !== undefined) {
            summary.scrollStats[depthKey] += 1;
          }
        }

        if (ev.elementId) {
          summary.elementRanking[ev.elementId] = (summary.elementRanking[ev.elementId] || 0) + 1;

          if (!summary.elementBreakdown[ev.elementId]) {
            summary.elementBreakdown[ev.elementId] = {
              count: 0,
              name: ev.elementText || ev.elementId,
              mobileCount: 0,
              desktopCount: 0,
              zaloCount: 0,
              rageCount: 0,
              deadCount: 0,
            };
          }
          const item = summary.elementBreakdown[ev.elementId];
          item.count += 1;
          if (ev.deviceType === "mobile") item.mobileCount += 1;
          else item.desktopCount += 1;
          if (ev.isZalo) item.zaloCount += 1;
          if (ev.type === "rage_click") item.rageCount += 1;
          if (ev.type === "dead_click") item.deadCount += 1;
          item.lastInteracted = Date.now();
        }
      }

      const updatedStore: HeatmapStore = {
        events: mergedEvents,
        summary,
      };

      // 4. Lưu lên KVDB
      await fetch(KVDB_HEATMAP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStore),
        keepalive: isExiting,
      });

      // Phát tín hiệu BroadcastChannel
      try {
        this.channel?.postMessage({ type: "new_heatmap_events", events: eventsToSend });
      } catch {}
    } catch (err) {
      this.queue = [...eventsToSend, ...this.queue];
    }
  }
}

// Global Singleton
let trackerInstance: HeatmapTracker | null = null;

export function getHeatmapTracker(): HeatmapTracker {
  if (!trackerInstance) {
    trackerInstance = new HeatmapTracker();
  }
  return trackerInstance;
}
