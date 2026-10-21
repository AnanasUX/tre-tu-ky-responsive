import React, { useState, useEffect, useRef } from "react"

export interface ChatMessage {
  id: string
  sender: "customer" | "admin" | "ai"
  senderName: string
  text: string
  timestamp: string
}

export interface LiveChatSession {
  id: string
  customerName: string
  customerPhone: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
  status: "online" | "waiting" | "replied" | "closed"
  unreadAdminCount?: number
  unreadCustomerCount?: number
}

const LEADS_API_URL = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/consultation_leads"
const CHAT_SESSIONS_URL = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/live_chat_sessions"
const CHAT_SETTINGS_URL = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/live_chat_settings"
const STORAGE_CHAT_KEY = "aurora_live_chat_session_v1"

// Cung cấp câu trả lời tự động thông minh của AI Cô Hương khi vắng mặt
function generateAiAutoReply(userQuestion: string, customerName: string): string {
  const q = userQuestion.toLowerCase()

  if (q.includes("chậm nói") || q.includes("bật âm") || q.includes("nói") || q.includes("ngôn ngữ")) {
    return `Dạ ba/mẹ ${customerName} ơi, đối với trẻ chậm nói hoặc chưa bật âm, giai đoạn vàng can thiệp là từ 18 tháng đến trước 3 tuổi. Tại trung tâm Cô Hương, các cô sẽ sử dụng kỹ thuật kích hoạt âm ngữ kết hợp điều hòa cảm giác và trị liệu 1:1 để con hứng thú giao tiếp tự nhiên. Ba mẹ có thể cho cô biết hiện tại con đã được bao nhiêu tháng tuổi và đã nói được từ đơn nào chưa ạ?`
  }

  if (q.includes("tự kỷ") || q.includes("hành vi") || q.includes("ăn vạ") || q.includes("la hét") || q.includes("giao tiếp mắt")) {
    return `Dạ ba/mẹ ${customerName}, với các biểu hiện giảm tương tác mắt, chưa chỉ ngón tay hoặc có hành vi lặp lại, Cô Hương áp dụng phương pháp can thiệp hành vi chức năng ABA phối hợp mô hình TEACCH để giúp con bình tĩnh, tăng khả năng tập trung và thấu hiểu mệnh lệnh. Cô Hương có thể gọi điện trực tiếp qua số Zalo của ba mẹ để hướng dẫn gia đình các kỹ thuật tương tác với con tại nhà ngay tối nay nhé ạ!`
  }

  if (q.includes("học phí") || q.includes("giá") || q.includes("chi phí") || q.includes("tiền học")) {
    return `Dạ ba/mẹ ${customerName}, học phí can thiệp tại trung tâm được thiết kế linh hoạt theo ca 1:1 (45 - 60 phút) hoặc ca bán trú, dao động từ 250.000đ - 350.000đ/buổi tùy theo mức độ cần hỗ trợ của từng bé. Đặc biệt, buổi đánh giá phát triển ban đầu của con hoàn toàn MIỄN PHÍ để gia đình an tâm hiểu rõ tình trạng của con trước khi quyết định can thiệp ạ.`
  }

  if (q.includes("địa chỉ") || q.includes("ở đâu") || q.includes("cơ sở") || q.includes("phòng khám")) {
    return `Dạ trung tâm Cô Hương hiện có các phòng can thiệp chuyên biệt yên tĩnh, đầy đủ trang thiết bị điều hòa cảm giác tại trung tâm TP. Hà Nội. Cô Hương xin phép gửi định vị bản đồ và hướng dẫn đường đi chi tiết qua số điện thoại/Zalo ${customerName} đã đăng ký để gia đình tiện đưa bé qua tham quan nhé ạ!`
  }

  if (q.includes("lịch") || q.includes("đánh giá") || q.includes("hẹn") || q.includes("khám") || q.includes("test")) {
    return `Dạ tuyệt vời quá ạ! Cô Hương tiếp nhận lịch đánh giá của bé nhà mình. Buổi đánh giá sẽ kéo dài khoảng 60 phút bao gồm: Quan sát tương tác của con, kiểm tra thang đo phát triển Denver/M-CHAT và trao đổi định hướng trực tiếp cùng ba mẹ. Chuyên viên trung tâm sẽ liên hệ lại ngay trong ít phút để xếp giờ phù hợp nhất cho gia đình ạ.`
  }

  return `Dạ Cô Hương đã nhận được câu hỏi của ba/mẹ ${customerName}: "${userQuestion}". Đội ngũ chuyên môn đang ghi nhận hồ sơ và sẽ phản hồi chi tiết ngay cho ba mẹ. Trong lúc chờ đợi, ba mẹ có thể gửi thêm video ngắn quay lại cử chỉ hoặc cách con chơi ở nhà để các cô phân tích chính xác nhất nhé ạ!`
}

export function LiveChatWidget({
  isOpen,
  onClose,
  phone = "096 290 3942",
}: {
  isOpen: boolean
  onClose: () => void
  phone?: string
}) {
  const [session, setSession] = useState<LiveChatSession | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [phoneInput, setPhoneInput] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollTimerRef = useRef<any>(null)

  // 1. Tải phiên chat từ LocalStorage nếu khách đã đăng ký trước đó
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSession(parsed)
      }
    } catch {}
  }, [])

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, session?.messages?.length, aiTyping])

  // 2. Đồng bộ dữ liệu real-time từ KVDB Cloud & BroadcastChannel
  useEffect(() => {
    if (!isOpen || !session?.id) return

    const syncSession = async () => {
      try {
        const res = await fetch(CHAT_SESSIONS_URL, { cache: "no-store" })
        if (res.ok) {
          const allSessions: LiveChatSession[] = await res.json()
          if (Array.isArray(allSessions)) {
            const current = allSessions.find((s) => s.id === session.id)
            if (current && current.messages.length !== session.messages.length) {
              setSession(current)
              localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(current))
            }
          }
        }
      } catch {}
    }

    // Polling mỗi 2.5 giây
    pollTimerRef.current = setInterval(syncSession, 2500)

    // Lắng nghe kênh nội bộ BroadcastChannel nếu admin đang mở cùng trình duyệt
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel("aurora_live_chat_channel")
      channel.onmessage = (event) => {
        if (event.data?.type === "SESSION_UPDATED" && event.data?.session?.id === session.id) {
          setSession(event.data.session)
          localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(event.data.session))
        }
      }
    } catch {}

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
      if (channel) channel.close()
    }
  }, [isOpen, session?.id, session?.messages?.length])

  // 3. Xử lý khi khách bấm Bắt đầu trò chuyện (Lưu tên + SĐT -> Đẩy lên Đăng ký tư vấn)
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    const cleanName = nameInput.trim()
    const cleanPhone = phoneInput.trim().replace(/[^0-9]/g, "")

    if (cleanName.length < 2) {
      setFormError("Vui lòng nhập họ và tên của ba/mẹ.")
      return
    }

    if (cleanPhone.length < 9 || cleanPhone.length > 11) {
      setFormError("Vui lòng nhập số điện thoại hoặc Zalo hợp lệ (9 - 11 chữ số).")
      return
    }

    setIsSubmittingForm(true)

    try {
      const sessionId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      const timestamp = new Date().toISOString()

      // A. Đẩy ngay thông tin vào "Đăng ký tư vấn" theo đúng yêu cầu
      const newLead = {
        id: `lead-livechat-${Date.now()}`,
        name: cleanName,
        phone: cleanPhone,
        childAge: "Đang trò chuyện qua Live Chat",
        note: `Khởi tạo cuộc trò chuyện Live Chat trực tiếp trên Website (Mã phiên: ${sessionId})`,
        source: "Live Chat Website",
        status: "new",
        createdAt: timestamp,
      }

      // Đẩy lên KVDB cho Đăng ký tư vấn
      try {
        const leadRes = await fetch(LEADS_API_URL, { cache: "no-store" })
        const existingLeads = leadRes.ok ? await leadRes.json() : []
        const updatedLeads = Array.isArray(existingLeads) ? [newLead, ...existingLeads] : [newLead]
        await fetch(LEADS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLeads),
        })

        // Bắn tín hiệu BroadcastChannel cho trang quản trị nếu đang mở
        try {
          const leadChannel = new BroadcastChannel("aurora_leads_channel")
          leadChannel.postMessage({ type: "NEW_LEAD", lead: newLead })
          leadChannel.close()
        } catch {}
      } catch (err) {
        console.warn("Could not save to leads db:", err)
      }

      // B. Khởi tạo phiên Chat với tin nhắn chào mừng từ Cô Hương
      const welcomeMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "admin",
        senderName: "Cô Hương (Trưởng ban chuyên môn)",
        text: `Dạ chào ba/mẹ ${cleanName}! Cô Hương và ban chuyên môn rất vui được lắng nghe gia đình. Ba mẹ đang quan tâm đến lộ trình can thiệp sớm, âm ngữ trị liệu hay muốn đặt lịch đánh giá cho bé nhà mình bao nhiêu tháng tuổi ạ?`,
        timestamp: new Date().toISOString(),
      }

      const initialSession: LiveChatSession = {
        id: sessionId,
        customerName: cleanName,
        customerPhone: cleanPhone,
        createdAt: timestamp,
        updatedAt: timestamp,
        messages: [welcomeMsg],
        status: "online",
        unreadAdminCount: 1,
        unreadCustomerCount: 0,
      }

      // Lưu phiên vào KVDB Sessions
      try {
        const sessRes = await fetch(CHAT_SESSIONS_URL, { cache: "no-store" })
        const existingSessions = sessRes.ok ? await sessRes.json() : []
        const updatedSessions = Array.isArray(existingSessions)
          ? [initialSession, ...existingSessions.filter((s) => s.id !== sessionId)]
          : [initialSession]

        await fetch(CHAT_SESSIONS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSessions),
        })

        // Bắn tín hiệu phiên chat mới cho Admin
        try {
          const chatChannel = new BroadcastChannel("aurora_live_chat_channel")
          chatChannel.postMessage({ type: "NEW_SESSION", session: initialSession })
          chatChannel.close()
        } catch {}
      } catch (err) {
        console.warn("Could not save chat session:", err)
      }

      // Cập nhật State & LocalStorage
      setSession(initialSession)
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(initialSession))
    } catch (err: any) {
      setFormError("Không thể kết nối máy chủ chat. Vui lòng thử lại.")
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // 4. Gửi tin nhắn từ phía Khách hàng
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || messageText).trim()
    if (!text || !session || isSending) return

    setIsSending(true)
    setMessageText("")

    const customerMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      sender: "customer",
      senderName: session.customerName,
      text,
      timestamp: new Date().toISOString(),
    }

    const updatedSession: LiveChatSession = {
      ...session,
      updatedAt: new Date().toISOString(),
      status: "waiting",
      unreadAdminCount: (session.unreadAdminCount || 0) + 1,
      messages: [...session.messages, customerMsg],
    }

    // Cập nhật giao diện ngay lập tức
    setSession(updatedSession)
    localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(updatedSession))

    // Đẩy lên Cloud KVDB
    try {
      const sessRes = await fetch(CHAT_SESSIONS_URL, { cache: "no-store" })
      const existingSessions = sessRes.ok ? await sessRes.json() : []
      const updatedList = Array.isArray(existingSessions)
        ? [updatedSession, ...existingSessions.filter((s) => s.id !== session.id)]
        : [updatedSession]

      await fetch(CHAT_SESSIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      })

      try {
        const chatChannel = new BroadcastChannel("aurora_live_chat_channel")
        chatChannel.postMessage({ type: "SESSION_UPDATED", session: updatedSession })
        chatChannel.close()
      } catch {}
    } catch (e) {
      console.warn("Error syncing message to cloud:", e)
    } finally {
      setIsSending(false)
    }

    // 5. Kiểm tra cấu hình AI Auto-Reply nếu quản lý chưa trả lời kịp thời
    triggerAiAutoReplyIfNeeded(text, updatedSession)
  }

  // Tự động kích hoạt phản hồi AI sau 3.5 giây nếu không có quản trị viên can thiệp
  const triggerAiAutoReplyIfNeeded = async (question: string, currentSession: LiveChatSession) => {
    try {
      // Đọc cấu hình live_chat_settings
      let aiEnabled = true
      try {
        const settingsRes = await fetch(CHAT_SETTINGS_URL, { cache: "no-store" })
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          if (settings && typeof settings.aiEnabled === "boolean") {
            aiEnabled = settings.aiEnabled
          }
        }
      } catch {}

      if (!aiEnabled) return

      // Hiển thị trạng thái đang soạn tin (typing)
      setAiTyping(true)

      setTimeout(async () => {
        // Sinh câu trả lời thông minh dựa trên chuyên môn can thiệp của Cô Hương
        const aiAnswer = generateAiAutoReply(question, currentSession.customerName)

        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          senderName: "🤖 Trợ lý AI Cô Hương (Tự động hỗ trợ)",
          text: aiAnswer,
          timestamp: new Date().toISOString(),
        }

        setSession((prev) => {
          if (!prev) return null
          const sessionWithAi: LiveChatSession = {
            ...prev,
            updatedAt: new Date().toISOString(),
            status: "replied",
            messages: [...prev.messages, aiMsg],
          }
          localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(sessionWithAi))

          // Đồng bộ vào KVDB
          fetch(CHAT_SESSIONS_URL, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : []))
            .then((sessions) => {
              const updatedList = Array.isArray(sessions)
                ? [sessionWithAi, ...sessions.filter((s: any) => s.id !== sessionWithAi.id)]
                : [sessionWithAi]
              fetch(CHAT_SESSIONS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedList),
              })
            })
            .catch(() => {})

          return sessionWithAi
        })

        setAiTyping(false)
      }, 3500)
    } catch {}
  }

  if (!isOpen) return null

  return (
    <div className="live-chat-portal" aria-labelledby="live-chat-title" role="dialog">
      <div className="live-chat-backdrop" onClick={onClose} />
      <div className="live-chat-window">
        {/* HEADER */}
        <header className="live-chat-header">
          <div className="live-chat-header__info">
            <div className="live-chat-avatar-wrap">
              <img
                src="./logo.png"
                alt="Cô Hương"
                className="live-chat-avatar"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = "none"
                }}
              />
              <span className="live-chat-online-dot" />
            </div>
            <div>
              <strong id="live-chat-title" className="live-chat-header__name">
                Lớp Can Thiệp Cô Hương
              </strong>
              <div className="live-chat-header__status">
                <span className="pulse-dot" />
                <span>Trực tuyến · Sẵn sàng giải đáp 24/7</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="live-chat-header__close-btn"
            onClick={onClose}
            aria-label="Đóng chat"
            title="Đóng cửa sổ chat"
          >
            ✕
          </button>
        </header>

        {/* BODY */}
        {!session ? (
          /* STEP 1: FORM THU THẬP HỌ TÊN VÀ SỐ ĐIỆN THOẠI TRƯỚC KHI CHAT */
          <div className="live-chat-register-body">
            <div className="live-chat-welcome-banner">
              <span className="welcome-emoji">👋</span>
              <h4>Chào mừng Ba/Mẹ đến với Lớp Can thiệp!</h4>
              <p>
                Để Cô Hương và ban chuyên môn nắm được thông tin và kịp thời liên hệ tư vấn lộ trình riêng cho bé, xin ba/mẹ vui lòng để lại:
              </p>
            </div>

            <form onSubmit={handleStartChat} className="live-chat-form">
              {formError && <div className="live-chat-form-error">⚠️ {formError}</div>}

              <div className="live-chat-form-field">
                <label htmlFor="chat_name">
                  Họ và tên của ba/mẹ <span className="req">*</span>
                </label>
                <input
                  id="chat_name"
                  type="text"
                  placeholder="Ví dụ: Mẹ Thu Trang, Bố Tuấn Anh..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="live-chat-form-field">
                <label htmlFor="chat_phone">
                  Số điện thoại / Zalo kết nối <span className="req">*</span>
                </label>
                <input
                  id="chat_phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Ví dụ: 096 290 3942..."
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  required
                />
                <small className="field-hint">
                  🔒 Thông tin được bảo mật 100% và tự động lưu vào danh sách tư vấn của trung tâm.
                </small>
              </div>

              <button
                type="submit"
                className="live-chat-start-btn"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? "Đang kết nối..." : "💬 Bắt đầu trò chuyện ngay"}
              </button>
            </form>

            <div className="live-chat-trust-note">
              <span>✓ Đánh giá ban đầu miễn phí</span>
              <span>✓ Tư vấn trực tiếp từ Cô Hương</span>
            </div>
          </div>
        ) : (
          /* STEP 2: GIAO DIỆN CHAT TRỰC TIẾP */
          <div className="live-chat-messages-container">
            <div className="live-chat-scroll-area">
              <div className="live-chat-session-badge">
                <span>Cuộc trò chuyện với {session.customerName} ({session.customerPhone})</span>
              </div>

              {session.messages.map((msg) => {
                const isCustomer = msg.sender === "customer"
                const isAi = msg.sender === "ai"

                return (
                  <div
                    key={msg.id}
                    className={`chat-bubble-row ${isCustomer ? "chat-bubble-row--customer" : "chat-bubble-row--agent"}`}
                  >
                    {!isCustomer && (
                      <div className="chat-bubble-avatar">
                        {isAi ? "🤖" : "👩‍🏫"}
                      </div>
                    )}
                    <div className="chat-bubble-content">
                      <div className="chat-bubble-meta">
                        <span className="chat-bubble-author">{msg.senderName}</span>
                        <span className="chat-bubble-time">
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div
                        className={`chat-bubble-box ${
                          isCustomer
                            ? "chat-bubble-box--customer"
                            : isAi
                            ? "chat-bubble-box--ai"
                            : "chat-bubble-box--admin"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })}

              {aiTyping && (
                <div className="chat-bubble-row chat-bubble-row--agent">
                  <div className="chat-bubble-avatar">🤖</div>
                  <div className="chat-bubble-content">
                    <span className="chat-bubble-author">Trợ lý AI Cô Hương</span>
                    <div className="chat-bubble-box chat-bubble-box--ai typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SUGGESTION PILLS */}
            <div className="live-chat-quick-pills">
              <button
                type="button"
                onClick={() => handleSendMessage("Bé nhà mình 2 tuổi chưa nói được từ đơn nào, cần hỗ trợ gì ạ?")}
              >
                🗣️ Trẻ 2 tuổi chậm nói
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Học phí và thời gian một buổi can thiệp là bao nhiêu ạ?")}
              >
                💰 Học phí & Ca học
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Mình muốn đăng ký lịch đánh giá phát triển miễn phí cho bé.")}
              >
                📅 Đặt lịch đánh giá
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Trung tâm có phương pháp can thiệp hành vi và cảm giác không?")}
              >
                🧩 Trị liệu cảm giác & ABA
              </button>
            </div>

            {/* INPUT FOOTER */}
            <form
              className="live-chat-input-bar"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
            >
              <input
                type="text"
                placeholder="Nhập câu hỏi của ba/mẹ tại đây..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                className="live-chat-send-btn"
                disabled={!messageText.trim() || isSending}
                title="Gửi tin nhắn"
              >
                ➤
              </button>
            </form>
          </div>
        )}

        {/* FOOTER SHORTCUT */}
        <footer className="live-chat-window-footer">
          <span>Hoặc gọi trực tiếp: <a href={`tel:${phone.replace(/[^0-9]/g, "")}`}>{phone}</a></span>
          <span>·</span>
          <span>Zalo: <a href={`https://zalo.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">Nhắn Zalo</a></span>
        </footer>
      </div>
    </div>
  )
}
