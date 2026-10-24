import React, { useState } from "react";

export interface ProgramTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  tagline: string;
  idealFor: string;
  ratio: string;
  schedule: string;
  focusAreas: string[];
  methods: string;
  includedServices: string[];
}

const INTERVENTION_PROGRAMS: ProgramTier[] = [
  {
    id: "individual",
    name: "Can thiệp Cá nhân 1:1 Chuyên sâu",
    badge: "Hiệu quả cao nhất",
    isPopular: true,
    tagline: "1 Giáo viên kèm 1 Trẻ - Lộ trình cá nhân hóa IEP tối đa",
    idealFor: "Trẻ chậm nói, chưa giao tiếp mắt, tự kỷ, tăng động giảm chú ý hoặc có hành vi khó",
    ratio: "1 Giáo viên : 1 Trẻ",
    schedule: "45 – 60 phút / ca (Linh hoạt 3 – 5 buổi/tuần)",
    focusAreas: [
      "Bật âm, phát triển vốn từ và ngôn ngữ giao tiếp chức năng",
      "Kéo dài giao tiếp mắt, tương tác hai chiều và chú ý liên kết",
      "Xử lý hành vi định hình, bùng nổ cảm xúc và rèn luyện kỹ năng tự phục vụ",
      "Điều hòa cảm giác (tiền đình, xúc giác, bản thể) qua phòng vận động OT",
    ],
    methods: "Kết hợp ABA (Phân tích hành vi ứng dụng), Denver ESDM, Âm ngữ trị liệu Speech Therapy",
    includedServices: [
      "Đánh giá phát triển định kỳ 3 tháng / lần",
      "Sổ nhật ký ca học chi tiết gửi phụ huynh mỗi ngày",
      "Video hướng dẫn bài tập thực hành tại nhà cho ba mẹ",
      "Trao đổi trực tiếp 10 phút sau mỗi buổi học cùng Cô Hương",
    ],
  },
  {
    id: "preschool",
    name: "Lớp Bán trú Tiền Tiểu học Hòa nhập",
    badge: "Chuẩn bị vào lớp 1",
    isPopular: false,
    tagline: "Môi trường mô phỏng trường mầm non và tiểu học thu nhỏ",
    idealFor: "Trẻ từ 3 – 6 tuổi đã có ngôn ngữ cơ bản, cần rèn luyện nề nếp lớp học, sự tự lập và hòa nhập nhóm",
    ratio: "2 Giáo viên : 5 – 7 Trẻ",
    schedule: "Bán trú cả ngày (07:30 – 16:30 từ Thứ 2 đến Thứ 6)",
    focusAreas: [
      "Kỹ năng ngồi bàn học, chú ý lắng nghe cô giáo và tuân theo hiệu lệnh",
      "Tự xúc ăn, tự đi vệ sinh, tự cất ba lô và bảo quản đồ dùng cá nhân",
      "Kỹ năng xã hội: xếp hàng, chờ đến lượt, chia sẻ đồ chơi cùng bạn",
      "Tiền đọc viết: làm quen chữ cái, con số, cầm bút và kéo thủ công",
    ],
    methods: "Mô hình TEACCH (Cấu trúc trực quan), Social Stories, Khen thưởng hành vi tích cực",
    includedServices: [
      "Chế độ ăn bán trú dinh dưỡng chuẩn mầm non",
      "Hoạt động ngoại khóa và dã ngoại trải nghiệm thực tế",
      "Báo cáo kỹ năng hòa nhập tháng & họp phụ huynh định kỳ",
      "Kết hợp 1 ca can thiệp 1:1 cá nhân trong tuần",
    ],
  },
  {
    id: "home-coaching",
    name: "Gói Hướng dẫn Phụ huynh Đồng hành tại Nhà",
    badge: "Linh hoạt cho gia đình ở xa",
    isPopular: false,
    tagline: "Chuyển giao phương pháp để ba mẹ trở thành người thầy tốt nhất của con",
    idealFor: "Gia đình ở xa chưa có điều kiện học hằng ngày, hoặc ba mẹ muốn đồng bộ cách dạy con tại nhà",
    ratio: "Chuyên gia : Gia đình",
    schedule: "1 – 2 buổi/tuần tại trung tâm hoặc hỗ trợ giám sát Online",
    focusAreas: [
      "Kỹ thuật chơi tương tác Floortime tạo hứng thú cho trẻ tại gia đình",
      "Cách sắp xếp môi trường sống hạn chế xao nhãng và kích thích nói",
      "Quy trình xử lý dứt điểm cơn ăn vạ, bùng nổ theo nguyên tắc ABA",
      "Thực đơn giác quan tại nhà: massage xúc giác, bài tập nhún nhảy thăng bằng",
    ],
    methods: "Coaching trực tiếp trên trẻ, phân tích video tình huống, giáo án gia đình IEP",
    includedServices: [
      "Bộ giáo cụ và thẻ tranh giao tiếp PECS mang về nhà",
      "Nhóm Zalo 1:1 tư vấn hỗ trợ liên tục trong ngày",
      "Review video phụ huynh dạy con 2 lần / tuần",
      "Cập nhật mục tiêu IEP linh hoạt theo tiến bộ thực tế",
    ],
  },
];

export function InterventionComparison() {
  const [activeTab, setActiveTab] = useState<string>("individual");

  const scrollToContact = (programName: string) => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      // Gợi ý điền tên chương trình vào ô nhu cầu
      setTimeout(() => {
        const needSelect = document.querySelector('select[name="need"]') as HTMLSelectElement;
        const messageInput = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
        if (needSelect) needSelect.value = "Can thiệp 1:1 cá nhân hóa";
        if (messageInput && !messageInput.value) {
          messageInput.value = `Gia đình quan tâm tìm hiểu chương trình: ${programName}. Mong được Cô Hương tư vấn chi tiết.`;
        }
      }, 500);
    }
  };

  return (
    <section className="section section--soft" id="programs-comparison">
      <div className="container">
        <div className="section-title">
          <span className="eyebrow">Minh bạch & Khoa học</span>
          <h2>So sánh các mô hình can thiệp tại Trung tâm</h2>
          <p>
            Mỗi đứa trẻ cần một lộ trình chuyên biệt. Bảng so sánh dưới đây giúp ba mẹ dễ dàng lựa chọn hình thức đồng hành tối ưu nhất theo giai đoạn phát triển và nhu cầu thực tế của con.
          </p>
        </div>

        {/* Tab chuyển đổi chương trình trên Mobile / Tablet */}
        <div className="comparison-tabs">
          {INTERVENTION_PROGRAMS.map((prog) => (
            <button
              key={prog.id}
              type="button"
              className={`comparison-tab-btn ${activeTab === prog.id ? "active" : ""}`}
              onClick={() => setActiveTab(prog.id)}
            >
              {prog.isPopular && <span className="tab-pill-sparkle">⭐</span>}
              <span>{prog.name}</span>
            </button>
          ))}
        </div>

        {/* Grid thẻ so sánh trực quan (Desktop 3 cột, Mobile hiển thị tab đang chọn hoặc vuốt) */}
        <div className="comparison-grid">
          {INTERVENTION_PROGRAMS.map((prog) => {
            const isSelected = activeTab === prog.id;
            return (
              <div
                key={prog.id}
                className={`comparison-card ${prog.isPopular ? "comparison-card--featured" : ""} ${
                  isSelected ? "comparison-card--active-mobile" : ""
                }`}
              >
                {prog.badge && (
                  <div className="comparison-card__badge-top">
                    <span>{prog.badge}</span>
                  </div>
                )}

                <div className="comparison-card__header">
                  <h3>{prog.name}</h3>
                  <p className="comparison-card__tagline">{prog.tagline}</p>
                </div>

                <div className="comparison-card__meta-box">
                  <div className="meta-item">
                    <span className="meta-label">👥 Tỉ lệ tương tác:</span>
                    <strong className="meta-val">{prog.ratio}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⏱️ Thời lượng:</span>
                    <strong className="meta-val">{prog.schedule}</strong>
                  </div>
                </div>

                <div className="comparison-card__body">
                  <div className="section-sub">
                    <span className="section-sub__title">🎯 Phù hợp nhất cho:</span>
                    <p className="section-sub__desc">{prog.idealFor}</p>
                  </div>

                  <div className="section-sub">
                    <span className="section-sub__title">🌱 Trọng tâm can thiệp:</span>
                    <ul className="comparison-checklist">
                      {prog.focusAreas.map((item, idx) => (
                        <li key={idx}>
                          <span className="check-icon">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="section-sub">
                    <span className="section-sub__title">📖 Phương pháp chủ đạo:</span>
                    <p className="method-pill">{prog.methods}</p>
                  </div>

                  <div className="section-sub">
                    <span className="section-sub__title">🎁 Quyền lợi đi kèm:</span>
                    <ul className="comparison-services">
                      {prog.includedServices.map((svc, idx) => (
                        <li key={idx}>
                          <span className="gift-icon">⭐</span>
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="comparison-card__footer">
                  <button
                    type="button"
                    className={`button ${prog.isPopular ? "button--primary" : "button--secondary"}`}
                    style={{ width: "100%" }}
                    onClick={() => scrollToContact(prog.name)}
                  >
                    Đăng ký tư vấn lộ trình này
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner cam kết chất lượng dưới bảng */}
        <div className="comparison-guarantee-strip">
          <div className="strip-item">
            <span className="strip-icon">🎯</span>
            <div>
              <strong>Cam kết tiến bộ theo từng giai đoạn IEP</strong>
              <small>Có thang đo đánh giá khoa học định kỳ rõ ràng</small>
            </div>
          </div>
          <div className="strip-divider" />
          <div className="strip-item">
            <span className="strip-icon">🤝</span>
            <div>
              <strong>Đồng hành 3 bên: Trung tâm – Gia đình – Trẻ</strong>
              <small>Chuyển giao kỹ thuật thực hành miễn phí cho phụ huynh</small>
            </div>
          </div>
          <div className="strip-divider" />
          <div className="strip-item">
            <span className="strip-icon">🎁</span>
            <div>
              <strong>Đánh giá ban đầu 60 phút MIỄN PHÍ</strong>
              <small>Không phát sinh chi phí khi chưa thống nhất mục tiêu</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
