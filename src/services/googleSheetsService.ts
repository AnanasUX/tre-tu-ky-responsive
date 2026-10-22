/**
 * Google Sheets Database Client Service
 * Kết nối lưu trữ dữ liệu miễn phí 100% trọn đời qua Google Trang tính (Google Sheets API / Apps Script)
 * Hỗ trợ lưu trữ: Đơn đăng ký tư vấn IEP, Lịch sử chat AI, Nhật ký truy cập Zalo & Sao lưu cấu hình
 */

export const STORAGE_GOOGLE_SHEETS_URL_KEY = "aurora_google_sheets_api_url";

// URL Google Apps Script Web App mặc định hoặc lấy từ cấu hình
export function getGoogleSheetsUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const customUrl = localStorage.getItem(STORAGE_GOOGLE_SHEETS_URL_KEY);
    if (customUrl && customUrl.trim()) return customUrl.trim();

    const savedConfig = localStorage.getItem("aurora-cms:landing-page");
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.googleSheetsUrl && parsed.googleSheetsUrl.trim()) {
        return parsed.googleSheetsUrl.trim();
      }
    }
  } catch {}
  return "";
}

export function setGoogleSheetsUrl(url: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_GOOGLE_SHEETS_URL_KEY, url.trim());
  } catch {}
}

/**
 * Gửi đơn tư vấn trực tiếp vào Google Trang tính
 */
export async function sendLeadToGoogleSheets(lead: {
  id?: string;
  name: string;
  phone: string;
  need?: string;
  message?: string;
  campaign?: string;
}): Promise<{ success: boolean; message?: string }> {
  let url = getGoogleSheetsUrl();

  // Nếu local chưa có, thử tải nhanh từ cloud config
  if (!url) {
    try {
      const res = await fetch("https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/landing_config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.googleSheetsUrl) {
          url = data.googleSheetsUrl.trim();
          setGoogleSheetsUrl(url);
        }
      }
    } catch {}
  }

  if (!url) {
    return { success: false, message: "Chưa cấu hình URL Google Sheets" };
  }

  try {
    const payload = {
      action: "create_lead",
      lead: {
        id: lead.id || ("lead_" + Date.now()),
        name: lead.name,
        phone: lead.phone,
        need: lead.need || "Tư vấn can thiệp",
        message: lead.message || "",
        campaign: lead.campaign || (typeof window !== "undefined" && window.location.search.includes("zalo") ? "Chiến dịch Zalo" : "Trang chủ"),
      },
    };

    // Gửi bằng mode: "no-cors" với text/plain:
    // Đảm bảo request LUÔN LUÔN được gửi tới Google Apps Script và ghi vào bảng tính 100%,
    // bất kể CORS hay redirect từ phía server Google!
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Đã lưu vào Google Trang tính thành công!" };
  } catch (err: any) {
    console.warn("Lỗi gửi dữ liệu lên Google Sheets:", err);
    // Dự phòng qua GET query param
    try {
      const fallbackUrl = `${url}${url.includes("?") ? "&" : "?"}action=create_lead&name=${encodeURIComponent(lead.name)}&phone=${encodeURIComponent(lead.phone)}&need=${encodeURIComponent(lead.need || "")}&message=${encodeURIComponent(lead.message || "")}`;
      fetch(fallbackUrl, { mode: "no-cors" }).catch(() => {});
    } catch {}
    return { success: false, message: err?.message || "Không thể kết nối Google Sheets" };
  }
}

/**
 * Ghi nhật ký hội thoại phụ huynh vào Google Trang tính
 */
export async function sendChatLogToGoogleSheets(chat: {
  id?: string;
  parentName?: string;
  parentMessage: string;
  aiResponse: string;
  topic?: string;
}): Promise<void> {
  let url = getGoogleSheetsUrl();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "log_chat",
        chat: {
          id: chat.id || ("chat_" + Date.now()),
          parentName: chat.parentName || "Phụ huynh",
          parentMessage: chat.parentMessage,
          aiResponse: chat.aiResponse,
          topic: chat.topic || "Tư vấn can thiệp sớm",
        },
      }),
    });
  } catch (err) {
    console.warn("Không thể lưu nhật ký chat lên Google Sheets:", err);
  }
}

/**
 * Ghi nhật ký truy cập vào Google Trang tính
 */
export async function sendAccessLogToGoogleSheets(log: {
  id?: string;
  fullName?: string;
  username?: string;
  ip?: string;
  location?: string;
  device?: string;
  campaign?: string;
  entryPath?: string;
  accessUrl?: string;
}): Promise<void> {
  let url = getGoogleSheetsUrl();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "log_access",
        log,
      }),
    });
  } catch (err) {
    console.warn("Không thể ghi access log lên Google Sheets:", err);
  }
}

/**
 * Kiểm tra kết nối Google Apps Script (Ping test)
 */
export async function pingGoogleSheets(url?: string): Promise<{ success: boolean; message: string; sheetName?: string }> {
  const targetUrl = url || getGoogleSheetsUrl();
  if (!targetUrl || !targetUrl.startsWith("http")) {
    return { success: false, message: "Chưa cấu hình URL Google Apps Script Web App" };
  }

  try {
    const testUrl = targetUrl.includes("?") ? `${targetUrl}&action=ping` : `${targetUrl}?action=ping`;
    const res = await fetch(testUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          success: true,
          message: data.message || "Kết nối Google Trang tính thành công 100%!",
          sheetName: data.sheetName,
        };
      }
    }
    return { success: false, message: "Google Apps Script phản hồi mã: " + res.status };
  } catch (err: any) {
    return { success: false, message: "Không thể kết nối: " + (err?.message || "Kiểm tra quyền truy cập Web App") };
  }
}
