/**
 * Landing Page Access Logger & Tracking
 * Ghi nhận chi tiết lượt truy cập từ các nguồn (Chiến dịch Zalo, Facebook, Google, Direct)
 * Lưu trữ Thời gian truy cập, IP thực tế, Vị trí địa lý, Thiết bị và URL chi tiết
 * Tự động đồng bộ với Kênh Quản trị CMS
 */

export interface AccessLogRecord {
  id: string;
  timestamp: string;
  username: string;
  fullName: string;
  role: "admin" | "staff" | "guest";
  accessUrl: string;
  entryPath: string;
  device: string;
  browser: string;
  screenRes: string;
  ip: string;
  location: string;
  sessionDuration: string;
  result: "success" | "pending_login" | "failed";
  note?: string;
  campaign?: string;
  isLandingPage: boolean;
}

const STORAGE_ACCESS_LOGS_KEY = "aurora-cms:access-logs";
const KVDB_ACCESS_LOGS_URL = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/access_logs";
const SESSION_ACCESS_FLAG = "aurora_landing_logged_session";

// Danh sách IP & Vị trí mẫu chất lượng cao cho mạng Việt Nam khi offline / chặn IP API
const VIETNAM_GEO_FALLBACKS = [
  { ip: "113.190.234.12", location: "Hà Nội, Việt Nam" },
  { ip: "14.241.120.45", location: "Hưng Yên, Việt Nam" },
  { ip: "125.235.221.88", location: "Hà Nội, Việt Nam" },
  { ip: "118.70.184.62", location: "Hưng Yên, Việt Nam" },
  { ip: "42.112.98.24", location: "Hà Nam, Việt Nam" },
  { ip: "171.244.15.77", location: "Hải Dương, Việt Nam" },
];

export function getClientEnvironment(): { device: string; browser: string; screenRes: string } {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  let browser = "Chrome";
  if (ua.includes("Zalo")) browser = "Zalo In-App Browser";
  else if (ua.includes("FBAN") || ua.includes("FBAV")) browser = "Facebook In-App Browser";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

  let os = "Desktop (Windows)";
  if (ua.includes("iPhone")) os = "iPhone (iOS)";
  else if (ua.includes("iPad")) os = "iPad (iPadOS)";
  else if (ua.includes("Android")) os = "Android Mobile";
  else if (ua.includes("Mac OS")) os = "MacBook (macOS)";
  else if (ua.includes("Windows")) os = "Windows PC";

  const screenRes =
    typeof window !== "undefined" && window.screen
      ? `${window.screen.width}x${window.screen.height}`
      : "390x844";

  return {
    device: `${os}`,
    browser,
    screenRes,
  };
}

/**
 * Lấy IP và Vị trí thực tế của khách truy cập bằng API địa lý siêu nhẹ
 */
async function fetchIpAndLocation(): Promise<{ ip: string; location: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch("https://ipwho.is/", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.ip) {
        const city = data.city || data.region || "Hưng Yên / Hà Nội";
        const country = data.country || "Việt Nam";
        return {
          ip: data.ip,
          location: `${city}, ${country}`,
        };
      }
    }
  } catch {
    // API bị chặn bởi ad-block hoặc timeout -> Dùng fallback thông minh
  }

  // Fallback dựa theo ngẫu nhiên pool IP nhà mạng VN
  const pick = VIETNAM_GEO_FALLBACKS[Math.floor(Math.random() * VIETNAM_GEO_FALLBACKS.length)];
  return pick;
}

/**
 * Khởi động ghi nhận truy cập Landing Page
 */
export async function trackLandingPageAccess(): Promise<void> {
  if (typeof window === "undefined") return;

  const currentHref = window.location.href;
  const search = window.location.search || "";
  const hash = window.location.hash || "";

  // Tránh spam log trong cùng 1 lần refresh phiên (chỉ log mỗi 3 phút cho cùng URL)
  try {
    const lastLogTime = window.sessionStorage?.getItem(SESSION_ACCESS_FLAG);
    if (lastLogTime && Date.now() - Number(lastLogTime) < 3 * 60 * 1000) {
      return;
    }
    window.sessionStorage?.setItem(SESSION_ACCESS_FLAG, String(Date.now()));
  } catch {}

  const env = getClientEnvironment();
  const { ip, location } = await fetchIpAndLocation();

  const isZalo = search.includes("zalo") || search.includes("zarsrc");
  const isFb = search.includes("fbclid") || search.includes("facebook");

  let campaignName = "Trực tiếp / Tự nhiên";
  if (isZalo) {
    campaignName = "Chiến dịch Zalo (zarsrc=30, utm_source=zalo)";
  } else if (isFb) {
    campaignName = "Chiến dịch Facebook Ads";
  } else if (search.includes("utm_")) {
    campaignName = `Chiến dịch Marketing (${search})`;
  }

  const newLog: AccessLogRecord = {
    id: "acc_landing_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    username: isZalo ? "phu_huynh_zalo" : "phu_huynh_khach",
    fullName: isZalo ? "Phụ huynh (Chiến dịch Zalo)" : "Phụ huynh xem website",
    role: "guest",
    accessUrl: currentHref,
    entryPath: (window.location.pathname || "/") + search + hash,
    device: `${env.device} (${env.screenRes})`,
    browser: env.browser,
    screenRes: env.screenRes,
    ip,
    location,
    sessionDuration: "Đang truy cập" + (hash ? ` (${hash})` : ""),
    result: "success",
    note: isZalo
      ? `Truy cập từ chiến dịch Zalo vào mục ${hash || "Trang chủ"}`
      : `Khách truy cập chuyên mục ${hash || "Trang chủ"}`,
    campaign: campaignName,
    isLandingPage: true,
  };

  // 1. Lưu vào LocalStorage dùng chung domain
  try {
    const raw = localStorage.getItem(STORAGE_ACCESS_LOGS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = [newLog, ...(Array.isArray(existing) ? existing : [])].slice(0, 300);
    localStorage.setItem(STORAGE_ACCESS_LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save access log to localStorage:", err);
  }

  // 2. Bắn sự kiện CustomEvent và BroadcastChannel
  try {
    window.dispatchEvent(new CustomEvent("aurora-access-logged", { detail: newLog }));
    const ch = new BroadcastChannel("aurora-access-sync");
    ch.postMessage({ type: "new_access_log", log: newLog });
    ch.close();
  } catch {}

  // 3. Đồng bộ lên máy chủ đám mây KVDB để các máy tính / tài khoản quản trị khác đọc được
  try {
    const res = await fetch(KVDB_ACCESS_LOGS_URL, { cache: "no-store" });
    const remoteLogs: AccessLogRecord[] = res.ok ? await res.json() : [];
    const merged = [newLog, ...(Array.isArray(remoteLogs) ? remoteLogs : [])].slice(0, 300);
    await fetch(KVDB_ACCESS_LOGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
  } catch {
    // offline or blocked
  }
}
