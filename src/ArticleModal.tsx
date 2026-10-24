import React from "react";

export interface ArticleData {
  id: string;
  category: string;
  title: string;
  summary: string;
  image: string;
  readTime: string;
  author: string;
  publishedDate: string;
  content: {
    heading: string;
    paragraphs: string[];
    tips?: string[];
  }[];
}

interface ArticleModalProps {
  article: ArticleData | null;
  onClose: () => void;
  onConsult: (articleTitle: string) => void;
}

export function ArticleModal({ article, onClose, onConsult }: ArticleModalProps) {
  if (!article) return null;

  return (
    <div className="account-modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="account-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "760px",
          width: "92%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
          animation: "modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Modal Header */}
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#166534",
                background: "#dcfce7",
                padding: "3px 10px",
                borderRadius: "999px",
              }}
            >
              {article.category}
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>⏱️ {article.readTime} đọc</span>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Đóng bài viết"
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1, color: "#475569" }}>✕</span>
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
            lineHeight: "1.7",
            color: "#334155",
            fontSize: "15.5px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: "1.3",
              marginBottom: "12px",
            }}
          >
            {article.title}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <span>✍️ Tác giả: <strong>{article.author}</strong></span>
            <span>📅 {article.publishedDate}</span>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                marginBottom: "24px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <img
                src={article.image}
                alt={article.title}
                style={{ width: "100%", maxHeight: "360px", objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {/* Lead Summary */}
          <div
            style={{
              background: "#f0fdf4",
              borderLeft: "4px solid #22c55e",
              padding: "14px 18px",
              borderRadius: "0 12px 12px 0",
              marginBottom: "24px",
              fontSize: "15px",
              color: "#166534",
              fontStyle: "italic",
            }}
          >
            {article.summary}
          </div>

          {/* Article Detailed Sections */}
          {article.content.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: "22px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e1b4b",
                  marginBottom: "10px",
                  marginTop: "16px",
                }}
              >
                {sec.heading}
              </h3>
              {sec.paragraphs.map((para, pIdx) => (
                <p key={pIdx} style={{ marginBottom: "10px" }}>
                  {para}
                </p>
              ))}
              {sec.tips && sec.tips.length > 0 && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    marginTop: "12px",
                  }}
                >
                  <strong style={{ display: "block", color: "#50008b", marginBottom: "6px" }}>
                    💡 Hướng dẫn thực hành cho ba mẹ:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {sec.tips.map((tip, tIdx) => (
                      <li key={tIdx} style={{ marginBottom: "4px", fontSize: "14.5px" }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Bottom Callout */}
          <div
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)",
              border: "1.5px solid #93c5fd",
              borderRadius: "16px",
              padding: "20px",
              marginTop: "28px",
              textAlign: "center",
            }}
          >
            <h4 style={{ margin: "0 0 8px", color: "#1e40af", fontSize: "17px", fontWeight: "700" }}>
              Ba mẹ đang lo lắng về sự phát triển của con?
            </h4>
            <p style={{ margin: "0 0 16px", color: "#1e3a8a", fontSize: "14px" }}>
              Đừng ngần ngại liên hệ với Cô Hương tại TDP Duyên Phúc, xã Hưng Hà, Tỉnh Hưng Yên để được tư vấn và đánh giá phát triển chuyên sâu hoàn toàn miễn phí.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  onClose();
                  onConsult(article.title);
                }}
                style={{ minHeight: "44px", padding: "10px 22px" }}
              >
                💬 Đăng ký tư vấn chủ đề này
              </button>
              <a
                className="button button--secondary"
                href="tel:0962903942"
                style={{ minHeight: "44px", padding: "10px 22px" }}
              >
                📞 Gọi hotline: 096 290 3942
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
