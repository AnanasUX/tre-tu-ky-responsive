/**
 * Touch & Click Heatmap / UX Interaction Analytics Tracker
 * Ghi nhận hành vi điểm chạm người dùng (Click, Touch, Scroll Depth, Rage & Dead Clicks)
 */

export interface HeatmapEvent {
  id: string;
  type: "click" | "tap" | "rage_click" | "dead_click" | "scroll_milestone";
  timestamp: number;
  sessionId: string;
  pageUrl: string;
  deviceType: "desktop" | "tablet" | "mobile";
  viewportWidth: number;
  viewportHeight: number;
  documentHeight: number;
  // Normalized coordinates (0 to 1) relative to total page dimensions
  xNorm: number;
  yNorm: number;
  docX: number;
  docY: number;
  elementId?: string;
  elementType?: string;
  elementText?: string;
  scrollDepth?: number;
}

export interface HeatmapStore {
  events: HeatmapEvent[];
  summary: {
    totalClicks: number;
    totalTaps: number;
    totalRageClicks: number;
    totalDeadClicks: number;
    totalSessions: number;
    scrollStats: {
      "25": number;
      "50": number;
      "75": number;
      "100": number;
    };
    elementRanking?: Record<string, number>;
  };
}

const KVDB_HEATMAP_URL = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/heatmap_data";
const SESSION_STORAGE_KEY = "aurora_heatmap_session_id";

function getAnonymousSessionId(): string {
  try {
    let sessId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessId) {
      sessId = "sess_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessId);
    }
    return sessId;
  } catch {
    return "sess_anonymous";
  }
}

function getDeviceType(): "desktop" | "tablet" | "mobile" {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export class HeatmapTracker {
  private queue: HeatmapEvent[] = [];
  private flushTimer: number | null = null;
  private sessionId = getAnonymousSessionId();
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

    // 1. Listen for clicks & taps
    window.addEventListener("pointerdown", this.handlePointerDown, { passive: true });

    // 2. Listen for scroll depth milestones
    window.addEventListener("scroll", this.handleScroll, { passive: true });

    // 3. Listen for page unload/hide to flush queue
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("pagehide", () => this.flush(true));

    // Initial scroll check
    this.checkScrollMilestones();

    // Start batch flush timer (every 6 seconds)
    this.flushTimer = window.setInterval(() => this.flush(false), 6000);
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
    // Exclude touches inside iframe or non-primary buttons
    if (event.button !== 0 && event.pointerType === "mouse") return;

    const docWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
    const docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);

    const docX = window.scrollX + event.clientX;
    const docY = window.scrollY + event.clientY;

    const xNorm = Math.min(1, Math.max(0, docX / docWidth));
    const yNorm = Math.min(1, Math.max(0, docY / docHeight));

    // Element identification
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Check for password or sensitive input (privacy protection)
    if (target instanceof HTMLInputElement && (target.type === "password" || target.type === "hidden")) {
      return;
    }

    const heatmapEl = target.closest<HTMLElement>("[data-heatmap-id]");
    const interactiveEl = target.closest<HTMLElement>("a, button, input, select, textarea, [role='button'], [tabindex]");

    const elementId = heatmapEl?.dataset.heatmapId || (interactiveEl ? this.generateElementSelector(interactiveEl) : undefined);
    const elementType = interactiveEl ? interactiveEl.tagName.toLowerCase() : target.tagName.toLowerCase();
    const elementText = interactiveEl ? (interactiveEl.getAttribute("aria-label") || interactiveEl.innerText?.substring(0, 30)?.trim()) : undefined;

    // Rage click & Dead click detection
    const now = Date.now();
    this.recentClicks.push({ time: now, x: docX, y: docY });
    // Keep only last 4 clicks within 1.2s
    this.recentClicks = this.recentClicks.filter((c) => now - c.time < 1200);

    let type: HeatmapEvent["type"] = event.pointerType === "touch" ? "tap" : "click";

    if (this.recentClicks.length >= 3) {
      const first = this.recentClicks[this.recentClicks.length - 3];
      const dist = Math.hypot(docX - first.x, docY - first.y);
      if (dist < 35) {
        type = "rage_click";
      }
    } else if (!interactiveEl && !heatmapEl && target.tagName !== "BODY" && target.tagName !== "HTML") {
      // Clicked on a static non-interactive element
      type = "dead_click";
    }

    const ev: HeatmapEvent = {
      id: "ev_" + Math.random().toString(36).substring(2, 9),
      type,
      timestamp: now,
      sessionId: this.sessionId,
      pageUrl: window.location.pathname + window.location.hash,
      deviceType: getDeviceType(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentHeight: docHeight,
      xNorm: Math.round(xNorm * 10000) / 10000,
      yNorm: Math.round(yNorm * 10000) / 10000,
      docX: Math.round(docX),
      docY: Math.round(docY),
      elementId,
      elementType,
      elementText,
    };

    this.queue.push(ev);

    // Live sync via BroadcastChannel for real-time visualization in admin
    try {
      this.channel?.postMessage({ type: "live_heatmap_event", event: ev });
    } catch {}

    // Flush immediately if queue reaches 15 events
    if (this.queue.length >= 15) {
      this.flush(false);
    }
  };

  private handleScroll = () => {
    this.checkScrollMilestones();
  };

  private checkScrollMilestones() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (docHeight <= 0) return;

    const currentScrollDepth = Math.min(100, Math.round(((scrollTop + windowHeight) / docHeight) * 100));

    const milestones = [25, 50, 75, 100];
    for (const m of milestones) {
      if (currentScrollDepth >= m && !this.scrollMilestones.has(m)) {
        this.scrollMilestones.add(m);

        const ev: HeatmapEvent = {
          id: "scr_" + Math.random().toString(36).substring(2, 9),
          type: "scroll_milestone",
          timestamp: Date.now(),
          sessionId: this.sessionId,
          pageUrl: window.location.pathname + window.location.hash,
          deviceType: getDeviceType(),
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          documentHeight: docHeight,
          xNorm: 0.5,
          yNorm: m / 100,
          docX: window.innerWidth / 2,
          docY: Math.round((docHeight * m) / 100),
          scrollDepth: m,
        };

        this.queue.push(ev);
        try {
          this.channel?.postMessage({ type: "live_heatmap_event", event: ev });
        } catch {}
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
      // 1. Fetch current stored heatmap data from KVDB
      const res = await fetch(KVDB_HEATMAP_URL, { cache: "no-store" });
      let store: HeatmapStore = {
        events: [],
        summary: {
          totalClicks: 0,
          totalTaps: 0,
          totalRageClicks: 0,
          totalDeadClicks: 0,
          totalSessions: 1,
          scrollStats: { "25": 0, "50": 0, "75": 0, "100": 0 },
          elementRanking: {},
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

      // 2. Append events (keep latest 1500 events to stay lightweight and fast)
      const mergedEvents = [...store.events, ...eventsToSend].slice(-1500);

      // 3. Update summary metrics
      const summary = store.summary || {
        totalClicks: 0,
        totalTaps: 0,
        totalRageClicks: 0,
        totalDeadClicks: 0,
        totalSessions: 1,
        scrollStats: { "25": 0, "50": 0, "75": 0, "100": 0 },
        elementRanking: {},
      };

      if (!summary.elementRanking) summary.elementRanking = {};

      for (const ev of eventsToSend) {
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
        }
      }

      const updatedStore: HeatmapStore = {
        events: mergedEvents,
        summary,
      };

      // 4. Save to KVDB
      await fetch(KVDB_HEATMAP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStore),
        keepalive: isExiting,
      });
    } catch (err) {
      // Re-queue events if send failed
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
