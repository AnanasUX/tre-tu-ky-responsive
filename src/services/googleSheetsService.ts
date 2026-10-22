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
  const url = getGoogleSheetsUrl();
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

    // Dùng text/plain để vượt qua CORS preflight của trình duyệt đối với Google Apps Script Web App
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({ success: true }));
      return { success: true, message: data.message || "Đã lưu vào Google Trang tính" };
    }
    return { success: false, message: "Máy chủ Google Sheets phản hồi lỗi: " + res.status };
  } catch (err: any) {
    console.warn("Lỗi gửi dữ liệu lên Google Sheets:", err);
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
  const url = getGoogleSheetsUrl();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
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
      redirect: "follow",
    });
  } catch {}
}

/**
 * Ghi nhật ký truy cập vào Google Trang tính
 */
export async function sendAccessLogToGoogleSheets(log: {
  id?: string;
  fullName?: string;
  ip?: string;
  location?: string;
  device?: string;
  campaign?: string;
  entryPath?: string;
}): Promise<void> {
  const url = getGoogleSheetsUrl();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "log_access",
        log,
      }),
      redirect: "follow",
    });
  } catch {}
}

/**
 * Kiểm tra kết nối với Google Apps Script Web App (Ping Test)
 */
export async function pingGoogleSheets(url: string): Promise<{ success: boolean; message: string; sheetName?: string }> {
  if (!url || !url.startsWith("http")) {
    return { success: false, message: "URL Google Apps Script không hợp lệ" };
  }

  try {
    const testUrl = url.includes("?") ? `${url}&action=ping` : `${url}?action=ping`;
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
          message: data.message || "Kết nối Google Trang tính thành công!",
          sheetName: data.sheetName,
        };
      }
    }
    return { success: false, message: "Google Apps Script phản hồi mã: " + res.status };
  } catch (err: any) {
    return { success: false, message: "Không thể kết nối: " + (err?.message || "Kiểm tra quyền truy cập") };
  }
}
