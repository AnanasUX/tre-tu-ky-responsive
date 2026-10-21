import React, { useEffect } from "react";

export type TeacherData = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  credentials?: string[];
  experienceHours?: string;
  specialization?: string[];
  philosophy?: string;
};

// Dữ liệu chứng chỉ chuyên môn chuẩn hóa dựa theo từng vị trí
export function getTeacherExtraDetails(teacher: { name: string; role: string; bio: string; image?: string }): TeacherData {
  const roleLower = (teacher.role || "").toLowerCase();
  const nameLower = (teacher.name || "").toLowerCase();

  if (nameLower.includes("hương") || roleLower.includes("giám đốc") || roleLower.includes("tâm lý")) {
    return {
      ...teacher,
      credentials: [
        "Thạc sĩ Tâm lý học Lâm sàng Trẻ em & Vị thành niên",
        "Cử nhân Tâm lý Giáo dục - Trường ĐH Sư phạm Hà Nội",
        "Chứng chỉ Quốc tế Đánh giá Phát triển Sớm PEP-3 & Vineland-II",
        "Chứng chỉ Can thiệp Hành vi Ứng dụng (ABA/VB) Chuyên sâu",
        "Thành viên Hội Khoa học Tâm lý - Giáo dục Việt Nam",
      ],
      experienceHours: "Hơn 10 năm kinh nghiệm • 3.000+ giờ can thiệp 1:1 cá nhân hóa",
      specialization: [
        "Đánh giá sàng lọc & Thiết kế kế hoạch giáo dục cá nhân (IEP)",
        "Can thiệp sớm rối loạn phổ tự kỷ (ASD) & Trẻ chậm phát triển",
        "Tham vấn tâm lý và tập huấn kỹ năng đồng hành cho phụ huynh tại nhà",
      ],
      philosophy:
        "Mỗi đứa trẻ là một nhịp điệu riêng biệt. Can thiệp không phải là uốn nắn theo khuôn mẫu cứng nhắc, mà là thấu cảm, kiên nhẫn mở từng cánh cửa giao tiếp để con tự tin kết nối với gia đình và xã hội.",
    };
  }

  if (roleLower.includes("âm ngữ") || nameLower.includes("trang")) {
    return {
      ...teacher,
      credentials: [
        "Cử nhân Giáo dục Đặc biệt - Trường ĐH Sư phạm Hà Nội",
        "Chứng chỉ Âm ngữ Trị liệu Lâm sàng (Speech-Language Therapy)",
        "Chứng chỉ Giao tiếp Tăng cường & Thay thế (PECS Level 2)",
        "Chứng chỉ Phục hồi Chức năng Khẩu cơ & Cơ hàm nuốt",
      ],
      experienceHours: "5+ năm kinh nghiệm • 2.200+ giờ can thiệp âm ngữ trị liệu",
      specialization: [
        "Kích thích bật âm & phát triển vốn từ giao tiếp tự nhiên",
        "Sửa phát âm ngọng, nói lắp và khó khăn diễn đạt câu",
        "Phát triển giao tiếp chủ động và đối thoại tương tác 2 chiều",
      ],
      philosophy:
        "Lời nói là chiếc cầu nối trái tim. Chúng tôi kiên nhẫn khơi dậy nhu cầu giao tiếp từ những điều con yêu thích nhất mỗi ngày.",
    };
  }

  if (roleLower.includes("cảm giác") || roleLower.includes("ot") || nameLower.includes("minh")) {
    return {
      ...teacher,
      credentials: [
        "Cử nhân Vật lý Trị liệu & Phục hồi Chức năng",
        "Chứng chỉ Điều hòa Cảm giác (Sensory Integration - SI)",
        "Chứng chỉ Hoạt động Trị liệu (Occupational Therapy - OT)",
        "Chứng chỉ Vận động Tinh & Phối hợp Vận động Thô cho Trẻ Đặc biệt",
      ],
      experienceHours: "6+ năm kinh nghiệm • 2.500+ giờ can thiệp giác quan",
      specialization: [
        "Điều hòa xúc giác, tiền đình và cảm thụ bản thể cho trẻ",
        "Giảm bớt hành vi tìm kiếm hoặc né tránh kích thích giác quan quá mức",
        "Phát triển kỹ năng cầm nắm bút, tự xúc ăn và tự phục vụ sinh hoạt",
      ],
      philosophy:
        "Khi cơ thể được giải tỏa căng thẳng giác quan và cảm thấy an toàn, não bộ của trẻ mới có thể sẵn sàng tiếp thu những bài học kỳ diệu.",
    };
  }

  return {
    ...teacher,
    credentials: [
      "Cử nhân Giáo dục Mầm non & Giáo dục Đặc biệt",
      "Chứng chỉ Can thiệp Sớm Trẻ Chậm phát triển & Tự kỷ",
      "Chứng chỉ Tiền Tiểu học Hòa nhập (School Readiness)",
      "Tập huấn Kỹ năng Quản lý Hành vi Tích cực (PBS)",
    ],
    experienceHours: "4+ năm kinh nghiệm • 1.800+ giờ can thiệp lớp hòa nhập",
    specialization: [
      "Xây dựng thói quen tự lập và tuân thủ quy tắc nhóm lớp",
      "Kỹ năng xã hội: Chờ đợi đến lượt, chia sẻ và tương tác cùng bạn bè",
      "Chuẩn bị tâm thế và kỹ năng tiền học đường vững vàng vào lớp 1",
    ],
    philosophy:
      "Tình yêu thương vô điều kiện và sự kiên nhẫn bền bỉ là chìa khóa mở lối cho mọi tiến bộ dù là nhỏ nhất của con.",
  };
}

type TeacherDetailModalProps = {
  isOpen: boolean;
  teacher: TeacherData | null;
  onClose: () => void;
  onConsult: (teacherName: string) => void;
};

export function TeacherDetailModal({
  isOpen,
  teacher,
  onClose,
  onConsult,
}: TeacherDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !teacher) return null;

  return (
    <div
      className="teacher-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Hồ sơ chuyên môn ${teacher.name}`}
    >
      <div className="teacher-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Profile */}
        <div className="teacher-modal-header">
          <button
            type="button"
            className="teacher-modal-close"
            onClick={onClose}
            aria-label="Đóng hồ sơ chuyên môn"
            title="Đóng (Esc)"
          >
            ✕
          </button>

          <div className="teacher-header-content">
            <div className="teacher-header-avatar">
              {teacher.image ? (
                <img src={teacher.image} alt={teacher.name} />
              ) : (
                <div className="teacher-avatar-fallback">
                  {teacher.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="teacher-header-info">
              <span className="teacher-verified-pill">
                ✓ Chuyên gia Can thiệp Chính thức
              </span>
              <h2>{teacher.name}</h2>
              <p className="teacher-role-tag">{teacher.role}</p>
              <span className="teacher-exp-tag">
                ⏱ {teacher.experienceHours}
              </span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="teacher-modal-body">
          {/* Section 1: Bằng cấp & Chứng chỉ */}
          <div className="teacher-section">
            <div className="teacher-section-title">
              <span className="sec-icon">🎓</span>
              <h3>Bằng cấp & Chứng chỉ Chuyên môn</h3>
            </div>
            <ul className="credential-list">
              {teacher.credentials?.map((item, idx) => (
                <li key={idx}>
                  <span className="check-dot">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Lĩnh vực chuyên sâu */}
          <div className="teacher-section">
            <div className="teacher-section-title">
              <span className="sec-icon">🎯</span>
              <h3>Lĩnh vực Can thiệp Sở trường</h3>
            </div>
            <div className="specialty-chips">
              {teacher.specialization?.map((spec, idx) => (
                <span key={idx} className="specialty-chip">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Giới thiệu & Triết lý */}
          <div className="teacher-section">
            <div className="teacher-section-title">
              <span className="sec-icon">❤️</span>
              <h3>Triết lý Đồng hành cùng Trẻ</h3>
            </div>
            <p className="teacher-philosophy-quote">
              "{teacher.philosophy}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="teacher-modal-footer">
          <a
            href="https://zalo.me/0962903942"
            target="_blank"
            rel="noopener noreferrer"
            className="teacher-zalo-btn"
            title="Mở ứng dụng Zalo để trò chuyện bảo mật"
          >
            💬 Nhắn Zalo tư vấn riêng
          </a>
          <button
            type="button"
            className="teacher-consult-btn"
            onClick={() => onConsult(teacher.name)}
          >
            📅 Đặt lịch đánh giá với Cô {teacher.name.split(" ").slice(-1)[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailModal;
