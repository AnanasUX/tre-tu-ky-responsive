import React, { useState } from "react"

export interface ScreenerQuestion {
  id: string
  text: string
  detail: string
  concernIf: "no" | "yes" // whether answering "no" or "yes" is a concern
}

export interface AgeGroupScreener {
  id: string
  label: string
  badge?: string
  questions: ScreenerQuestion[]
  homeExercises: {
    title: string
    description: string
  }[]
}

const AGE_GROUPS_DATA: AgeGroupScreener[] = [
  {
    id: "12-18",
    label: "12 - 18 tháng",
    questions: [
      {
        id: "q1",
        text: "Gọi tên con ở khoảng cách gần, con có phản xạ quay đầu hoặc nhìn lại không?",
        detail: "Phản hồi tên gọi là mốc quan trọng nhất của sự chú ý liên kết.",
        concernIf: "no",
      },
      {
        id: "q2",
        text: "Con có giao tiếp bằng mắt (eye-contact) khi được ba mẹ bế, nựng hoặc nói chuyện không?",
        detail: "Giao tiếp mắt tự nhiên là nền tảng của kết nối cảm xúc xã hội.",
        concernIf: "no",
      },
      {
        id: "q3",
        text: "Con có dùng ngón tay trỏ để chỉ vào đồ vật con muốn lấy hoặc muốn khoe không?",
        detail: "Cử chỉ chỉ tay trỏ thể hiện nhận thức và mong muốn giao tiếp phi ngôn ngữ.",
        concernIf: "no",
      },
      {
        id: "q4",
        text: "Con có bập bẹ các âm đôi như 'ba-ba', 'ma-ma', 'da-da' không?",
        detail: "Giai đoạn này trẻ bắt đầu phát triển vùng phát âm tiền ngôn ngữ.",
        concernIf: "no",
      },
      {
        id: "q5",
        text: "Con có thường xuyên chơi một mình, không quan tâm người lớn xung quanh đang làm gì không?",
        detail: "Thiếu tương tác chia sẻ có thể là tín hiệu cần quan sát thêm.",
        concernIf: "yes",
      },
    ],
    homeExercises: [
      {
        title: "Trò chơi 'Ú òa' giữ ánh mắt 3-5 giây",
        description: "Ngồi ngang tầm mắt con, che mặt sau tấm khăn rồi mở ra với biểu cảm vui tươi để kích thích con duy trì giao tiếp mắt.",
      },
      {
        title: "Bắt chước âm thanh con phát ra",
        description: "Khi con bập bẹ bất kỳ âm nào, ba mẹ hãy lặp lại âm đó ngay lập tức để con hiểu rằng tiếng nói của mình tạo ra sự tương tác.",
      },
      {
        title: "Dạy ngón trỏ chỉ đồ vật yêu thích",
        description: "Cầm tay con, tách ngón trỏ và cùng chạm vào món đồ chơi con thích kèm từ gọi tên rõ ràng.",
      },
    ],
  },
  {
    id: "18-24",
    label: "18 - 24 tháng",
    badge: "Giai đoạn vàng can thiệp",
    questions: [
      {
        id: "q1",
        text: "Con đã nói được ít nhất 6 - 10 từ đơn rõ nghĩa (ba, mẹ, cá, măm, đi, bóng...) chưa?",
        detail: "Giai đoạn 18-24 tháng vốn từ vựng của trẻ phát triển bùng nổ.",
        concernIf: "no",
      },
      {
        id: "q2",
        text: "Con có hiểu và làm theo mệnh lệnh đơn giản như 'Lấy giày cho mẹ', 'Lại đây với ba' không?",
        detail: "Khả năng hiểu ngôn ngữ thường đi trước khả năng diễn đạt lời nói.",
        concernIf: "no",
      },
      {
        id: "q3",
        text: "Con có biết bắt chước hành động của ba mẹ (vỗ tay, vẫy tay chào, giả vờ nghe điện thoại) không?",
        detail: "Trẻ học giao tiếp và kỹ năng xã hội chủ yếu qua bắt chước.",
        concernIf: "no",
      },
      {
        id: "q4",
        text: "Con có hành vi lặp đi lặp lại như nhón chân khi đi, xoay tròn bánh xe, vẫy tay trước mắt không?",
        detail: "Hành vi định hình hoặc tìm kiếm cảm giác lặp lại kéo dài.",
        concernIf: "yes",
      },
      {
        id: "q5",
        text: "Con có hay dắt tay người lớn đặt vào đồ vật thay vì chỉ tay hoặc nhìn vào mắt người lớn không?",
        detail: "Dùng tay người khác như một công cụ cơ học là một dấu hiệu kinh điển cần lưu ý.",
        concernIf: "yes",
      },
    ],
    homeExercises: [
      {
        title: "Kỹ thuật 'Tạo tình huống có vấn đề'",
        description: "Để món đồ chơi con thích trong hộp trong suốt đóng nắp, chờ con nhìn vào mắt hoặc phát âm mới hỗ trợ mở hộp.",
      },
      {
        title: "Đưa ra 2 lựa chọn trực quan",
        description: "Cầm 2 món đồ (ví dụ: quả táo & bánh), hỏi: 'Con muốn táo hay bánh?' để kích thích con đưa ra lựa chọn bằng lời hoặc chỉ tay.",
      },
      {
        title: "Gọi tên đồ vật kèm nhịp điệu bài hát",
        description: "Hát các bài đồng dao ngắn, ngưng ở từ cuối cùng để khuyến khích con điền từ tiếp theo.",
      },
    ],
  },
  {
    id: "24-36",
    label: "24 - 36 tháng",
    questions: [
      {
        id: "q1",
        text: "Con đã nói được cụm 2 từ trở lên như 'Mẹ bế', 'Uống nước', 'Đi chơi' chưa?",
        detail: "Mốc 2 tuổi trẻ cần ghép được từ đôi để diễn đạt nhu cầu cơ bản.",
        concernIf: "no",
      },
      {
        id: "q2",
        text: "Con có chơi trò chơi giả vờ (cho gấu ăn, nấu ăn, lái xe đồ chơi) không?",
        detail: "Trò chơi biểu trưng thể hiện sự phát triển nhận thức và trí tưởng tượng.",
        concernIf: "no",
      },
      {
        id: "q3",
        text: "Con có thể trả lời các câu hỏi đơn giản như 'Con tên là gì?', 'Con mấy tuổi?' không?",
        detail: "Giao tiếp đối thoại 2 chiều bắt đầu hoàn thiện trong giai đoạn này.",
        concernIf: "no",
      },
      {
        id: "q4",
        text: "Con có quá nhạy cảm với âm thanh lớn (bịt tai sợ tiếng máy xay, máy sấy) hoặc kén chọn thái quá về thức ăn không?",
        detail: "Dấu hiệu của rối loạn xử lý điều hòa cảm giác (Sensory Processing).",
        concernIf: "yes",
      },
      {
        id: "q5",
        text: "Con có phản ứng dữ dội (la hét, ăn vạ kéo dài) khi có sự thay đổi nhỏ về lịch sinh hoạt hoặc đường đi quen thuộc không?",
        detail: "Sự chống cự thay đổi và tính cứng nhắc trong thói quen sinh hoạt.",
        concernIf: "yes",
      },
    ],
    homeExercises: [
      {
        title: "Mở rộng câu (Expansion Technique)",
        description: "Khi con nói 1 từ 'Xe', ba mẹ lặp lại và mở rộng thành cụm 'Đúng rồi, xe chạy nhanh' để làm giàu vốn từ.",
      },
      {
        title: "Trò chơi đóng vai chia sẻ",
        description: "Cùng con đóng vai bác sĩ khám bệnh cho gấu bông, xúc cơm cho búp bê để rèn luyện kỹ năng xã hội.",
      },
      {
        title: "Điều hòa vận động giác quan tại nhà",
        description: "Cho con bò chui qua gối, lăn trên thảm xốp hoặc vác thú bông nặng để giải tỏa năng lượng và ổn định cảm giác.",
      },
    ],
  },
  {
    id: "36plus",
    label: "Trên 3 tuổi",
    questions: [
      {
        id: "q1",
        text: "Con có thể kể lại một câu chuyện ngắn hoặc nói về những việc diễn ra ở lớp mầm non không?",
        detail: "Khả năng tường thuật và sử dụng ngôn ngữ mạch lạc.",
        concernIf: "no",
      },
      {
        id: "q2",
        text: "Con có biết chơi tương tác, chờ đến lượt và chia sẻ đồ chơi cùng các bạn đồng trang lứa không?",
        detail: "Kỹ năng tương tác xã hội ngang hàng là yêu cầu quan trọng chuẩn bị vào lớp 1.",
        concernIf: "no",
      },
      {
        id: "q3",
        text: "Lời nói của con người ngoài (không phải ba mẹ) có thể hiểu được khoảng 75% không?",
        detail: "Độ rõ ràng của âm ngữ và phát âm ở lứa tuổi lên 3 - 4.",
        concernIf: "no",
      },
      {
        id: "q4",
        text: "Con có hay nhại lời (nhại lại nguyên văn câu hỏi của người khác hoặc thoại quảng cáo vô nghĩa) không?",
        detail: "Hiện tượng Echolalia (nhại lời không chủ đích).",
        concernIf: "yes",
      },
      {
        id: "q5",
        text: "Con có gặp khó khăn lớn trong việc tự xúc ăn, tự mặc quần áo hoặc tự đi vệ sinh không?",
        detail: "Kỹ năng tự lập và phối hợp vận động tinh / thô.",
        concernIf: "yes",
      },
    ],
    homeExercises: [
      {
        title: "Nhật ký hình ảnh hàng ngày (Visual Schedule)",
        description: "Dùng các thẻ tranh ảnh gắn lịch trình sáng - trưa - chiều để giúp con tự lập và chủ động chuẩn bị tâm lý.",
      },
      {
        title: "Kể chuyện qua tranh có câu hỏi gợi mở",
        description: "Đọc sách cùng con và hỏi: 'Tại sao bạn thỏ lại khóc?', 'Con đoán xem tiếp theo sẽ thế nào?' để tăng tư duy nhân quả.",
      },
      {
        title: "Trò chơi chờ lượt (Turn-taking Games)",
        description: "Chơi xếp gỗ rút, lăn bóng qua lại kèm quy ước rõ ràng: 'Lượt của mẹ - rồi đến lượt con'.",
      },
    ],
  },
]

export function DevelopmentalScreener() {
  const [selectedAgeId, setSelectedAgeId] = useState("18-24")
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const currentAgeGroup = AGE_GROUPS_DATA.find((g) => g.id === selectedAgeId) || AGE_GROUPS_DATA[1]

  const handleSelectAnswer = (questionId: string, answer: "yes" | "no") => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleAgeChange = (ageId: string) => {
    setSelectedAgeId(ageId)
    setAnswers({})
    setShowResult(false)
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = currentAgeGroup.questions.length
  const isComplete = answeredCount === totalQuestions

  const handleRunAnalysis = () => {
    if (!isComplete) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResult(true)
    }, 700)
  }

  const handleReset = () => {
    setAnswers({})
    setShowResult(false)
  }

  // Calculate concern score
  let concernPoints = 0
  currentAgeGroup.questions.forEach((q) => {
    const userAns = answers[q.id]
    if (userAns && userAns === q.concernIf) {
      concernPoints++
    }
  })

  let riskLevel: "low" | "medium" | "high" = "low"
  if (concernPoints >= 3) {
    riskLevel = "high"
  } else if (concernPoints >= 1) {
    riskLevel = "medium"
  }

  return (
    <section className="section section--lavender" id="screener" style={{ position: "relative", overflow: "hidden" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title reveal" style={{ maxWidth: 840, margin: "0 auto 36px", textAlign: "center" }}>
          <span className="section-title__note" style={{ display: "inline-block", marginBottom: 10 }}>
            🧪 CÔNG CỤ SÀNG LỌC PHÁT TRIỂN SỚM (DENVER II & M-CHAT-R)
          </span>
          <h2 style={{ fontSize: "var(--font-h2-size, 32px)", lineHeight: 1.3, marginBottom: 14 }}>
            Kiểm tra mốc phát triển & Nguy cơ chậm nói / Tự kỷ cho con (60 giây)
          </h2>
          <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.6 }}>
            Ba mẹ chọn độ tuổi của con và chạm nhanh 5 câu hỏi quan sát thực tế để nhận đánh giá sơ bộ, lời khuyên thấu cảm từ Cô Hương và gợi ý bài tập kích hoạt ngôn ngữ tại nhà.
          </p>
        </div>

        {/* Screener Interactive Card */}
        <div
          className="screener-card reveal"
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 12px 32px -4px rgba(80, 0, 139, 0.08), 0 4px 12px rgba(80, 0, 139, 0.04)",
            border: "1px solid rgba(80, 0, 139, 0.1)",
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          {/* STEP 1: AGE GROUP SELECTOR */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 12 }}>
              BƯỚC 1: CHỌN ĐỘ TUỔI HIỆN TẠI CỦA CON
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {AGE_GROUPS_DATA.map((ag) => {
                const isSelected = ag.id === selectedAgeId
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => handleAgeChange(ag.id)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 14,
                      border: isSelected ? "2px solid var(--primary, #50008b)" : "1.5px solid #e2e8f0",
                      background: isSelected ? "rgba(80, 0, 139, 0.05)" : "#f8fafc",
                      color: isSelected ? "var(--primary, #50008b)" : "#475569",
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: 14,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    <span>{ag.label}</span>
                    {ag.badge && (
                      <span
                        style={{
                          display: "block",
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "#d97706",
                          marginTop: 3,
                        }}
                      >
                        ★ {ag.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: QUESTIONS */}
          {!showResult && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>
                  BƯỚC 2: CHẠM CÂU TRẢ LỜI QUAN SÁT THỰC TẾ CỦA CON
                </label>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#50008b" }}>
                  Đã trả lời: {answeredCount} / {totalQuestions}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                    background: "var(--primary, #50008b)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Questions List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {currentAgeGroup.questions.map((q, idx) => {
                  const currentAnswer = answers[q.id]
                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: "18px 20px",
                        borderRadius: 16,
                        background: currentAnswer ? "#fcfaff" : "#f8fafc",
                        border: currentAnswer ? "1px solid rgba(80, 0, 139, 0.2)" : "1px solid #e2e8f0",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 340px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary, #50008b)", display: "block", marginBottom: 4 }}>
                            CÂU HỎI {idx + 1}
                          </span>
                          <strong style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.45, display: "block" }}>
                            {q.text}
                          </strong>
                          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#64748b" }}>
                            💡 {q.detail}
                          </p>
                        </div>

                        {/* Options */}
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, "yes")}
                            style={{
                              padding: "9px 18px",
                              borderRadius: 10,
                              fontSize: 13.5,
                              fontWeight: 700,
                              cursor: "pointer",
                              border: currentAnswer === "yes" ? "2px solid #16a34a" : "1.5px solid #cbd5e1",
                              background: currentAnswer === "yes" ? "#dcfce7" : "#ffffff",
                              color: currentAnswer === "yes" ? "#15803d" : "#475569",
                              transition: "all 0.15s ease",
                            }}
                          >
                            ✓ Có / Thường xuyên
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, "no")}
                            style={{
                              padding: "9px 18px",
                              borderRadius: 10,
                              fontSize: 13.5,
                              fontWeight: 700,
                              cursor: "pointer",
                              border: currentAnswer === "no" ? "2px solid #dc2626" : "1.5px solid #cbd5e1",
                              background: currentAnswer === "no" ? "#fee2e2" : "#ffffff",
                              color: currentAnswer === "no" ? "#b91c1c" : "#475569",
                              transition: "all 0.15s ease",
                            }}
                          >
                            ✗ Hiếm khi / Chưa có
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 28, textAlign: "center" }}>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleRunAnalysis}
                  disabled={!isComplete || isAnalyzing}
                  style={{
                    padding: "14px 36px",
                    fontSize: 15,
                    fontWeight: 700,
                    borderRadius: 12,
                    opacity: !isComplete ? 0.6 : 1,
                    cursor: !isComplete ? "not-allowed" : "pointer",
                    boxShadow: isComplete ? "0 8px 20px rgba(80, 0, 139, 0.25)" : "none",
                  }}
                >
                  {isAnalyzing ? "Đang phân tích kết quả..." : isComplete ? "⚡ Xem Kết Quả Phân Tích & Lời Khuyên Từ Cô Hương" : `Vui lòng trả lời đủ 5 câu hỏi (${answeredCount}/5)`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT REPORT */}
          {showResult && (
            <div className="screener-result reveal" style={{ marginTop: 8 }}>
              {/* Risk Level Banner */}
              <div
                style={{
                  padding: "24px 28px",
                  borderRadius: 18,
                  background:
                    riskLevel === "low"
                      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                      : riskLevel === "medium"
                      ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
                      : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                  border:
                    riskLevel === "low"
                      ? "1.5px solid #86efac"
                      : riskLevel === "medium"
                      ? "1.5px solid #fde68a"
                      : "1.5px solid #fca5a5",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>
                    {riskLevel === "low" ? "🟢" : riskLevel === "medium" ? "🟡" : "🔴"}
                  </span>
                  <div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: riskLevel === "low" ? "#166534" : riskLevel === "medium" ? "#92400e" : "#991b1b",
                      }}
                    >
                      KẾT QUẢ ĐÁNH GIÁ SƠ BỘ (LỨA TUỔI {currentAgeGroup.label})
                    </span>
                    <h3 style={{ margin: 0, fontSize: 20, color: "#1e1b4b" }}>
                      {riskLevel === "low"
                        ? "Mức độ Nguy cơ Thấp - Con đang phát triển phù hợp lứa tuổi"
                        : riskLevel === "medium"
                        ? "Mức độ Cần Theo Dõi Thêm - Có 1 đến 2 biểu hiện chậm nhịp"
                        : "Mức độ Cần Đánh Giá Can Thiệp Sớm - Có các dấu hiệu cảnh báo then chốt"}
                    </h3>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: 14.5, color: "#334155", lineHeight: 1.6 }}>
                  {riskLevel === "low" && (
                    <>
                      Con có các phản xạ tương tác xã hội và giao tiếp cơ bản tương đối tốt. Ba mẹ hãy tiếp tục duy trì việc trò chuyện hàng ngày, giảm thời gian xem tivi/điện thoại và thực hành các bài tập gợi ý bên dưới để hỗ trợ con phát triển tối đa.
                    </>
                  )}
                  {riskLevel === "medium" && (
                    <>
                      Ghi nhận con có <strong>{concernPoints} điểm cần lưu ý</strong> trong phản xạ giao tiếp hoặc phát triển ngôn ngữ. Đây chưa phải là khẳng định bệnh lý, nhưng ba mẹ không nên chờ đợi 'lớn lên con tự biết nói'. Hãy tích cực kích hoạt giao tiếp tại nhà và liên hệ Cô Hương để được đánh giá phát triển chuyên sâu miễn phí.
                    </>
                  )}
                  {riskLevel === "high" && (
                    <>
                      Ghi nhận con có <strong>{concernPoints} dấu hiệu báo động đỏ (Red Flags)</strong> về giao tiếp mắt, phản hồi tên gọi hoặc định hình hành vi. <strong>Giai đoạn 18 - 36 tháng là thời gian vàng không thể lấy lại</strong>. Ba mẹ nên đưa con đến Trung tâm tại <strong>TDP Duyên Phúc, xã Hưng Hà, Tỉnh Hưng Yên</strong> để thực hiện bài test chuẩn Denver II & M-CHAT-R 1:1 cùng Cô Hương ngay trong tuần này.
                    </>
                  )}
                </p>
              </div>

              {/* Home Exercises tailored to Age Group */}
              <div style={{ marginBottom: 28 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", marginBottom: 14 }}>
                  📋 GỢI Ý 3 BÀI TẬP TƯƠNG TÁC TẠI NHÀ TỪ CÔ HƯƠNG (PHÙ HỢP ĐỘ TUỔI {currentAgeGroup.label})
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                  {currentAgeGroup.homeExercises.map((ex, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 14,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: 14, color: "var(--primary, #50008b)", marginBottom: 6 }}>
                        {i + 1}. {ex.title}
                      </strong>
                      <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.55 }}>
                        {ex.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons to Connect with Cô Hương */}
              <div
                style={{
                  padding: "20px 24px",
                  borderRadius: 16,
                  background: "rgba(80, 0, 139, 0.04)",
                  border: "1px solid rgba(80, 0, 139, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <strong style={{ fontSize: 15, color: "#1e1b4b", display: "block" }}>
                    Ba mẹ cần trao đổi riêng tư về kết quả của con với Cô Hương?
                  </strong>
                  <span style={{ fontSize: 13, color: "#64748b" }}>
                    Tư vấn miễn phí 1:1, đánh giá thang đo Denver II trực tiếp tại TDP Duyên Phúc, Hưng Hà, Hưng Yên.
                  </span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    href={`https://zalo.me/0962903942?text=${encodeURIComponent(`Chào Cô Hương, tôi vừa làm bài kiểm tra phát triển mốc ${currentAgeGroup.label} cho con trên web và có kết quả mức độ ${riskLevel === "low" ? "nguy cơ thấp" : riskLevel === "medium" ? "cần theo dõi" : "cần can thiệp sớm"} (${concernPoints}/5 điểm). Nhờ Cô Hương tư vấn giúp gia đình tôi.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--primary"
                    style={{
                      background: "#0284c7",
                      borderColor: "#0284c7",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13.5,
                      padding: "10px 18px",
                      borderRadius: 10,
                    }}
                  >
                    <span>💬 Nhắn Zalo Cô Hương (096 290 3942)</span>
                  </a>

                  <a
                    href="tel:0962903942"
                    className="button button--secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13.5,
                      padding: "10px 18px",
                      borderRadius: 10,
                    }}
                  >
                    <span>📞 Gọi Hotline ngay</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#475569",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Làm lại bài test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
