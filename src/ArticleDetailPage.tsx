import React, { useEffect, useState } from "react";
import { ArticleData, getRelatedArticles } from "./articlesData";

interface ArticleDetailPageProps {
  article: ArticleData;
  onBack: () => void;
  onSelectArticle: (article: ArticleData) => void;
  onConsult: (articleTitle: string) => void;
}

export function ArticleDetailPage({
  article,
  onBack,
  onSelectArticle,
  onConsult,
}: ArticleDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Lấy các bài viết liên quan
  const relatedArticles = getRelatedArticles(article.id, article.category, 3);

  // Cuộn lên đầu trang khi bài viết thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [article.id]);

  // Thanh tiến trình đọc bài viết
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        setScrollProgress((el.scrollTop / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#/bai-viet/${article.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  const handleShareFacebook = () => {
    const shareUrl = encodeURIComponent(
      `${window.location.origin}${window.location.pathname}#/bai-viet/${article.id}`
    );
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank");
  };

  const handleShareZalo = () => {
    const shareUrl = encodeURIComponent(
      `${window.location.origin}${window.location.pathname}#/bai-viet/${article.id}`
    );
    window.open(`https://zalo.me/share?url=${shareUrl}`, "_blank");
  };

  return (
    <div className="article-detail-page" style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b" }}>
      {/* Reading Progress Indicator */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "4px",
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #2563eb, #7c3aed)",
          zIndex: 9999,
          transition: "width 0.1s ease",
        }}
      />

      {/* Sticky Top Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 1000,
          padding: "12px 20px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={onBack}
            className="button button--secondary"
            style={{
              padding: "8px 16px",
              minHeight: "38px",
              fontSize: "14px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <span>← Quay lại Cẩm nang</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", color: "#64748b", display: "none" }} className="article-nav-center-name">
              Trung tâm Hỗ trợ Trẻ tự kỷ Cô Hương
            </span>
            <button
              type="button"
              className="button button--primary"
              onClick={() => onConsult(article.title)}
              style={{
                padding: "8px 18px",
                minHeight: "38px",
                fontSize: "14px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>💬 Tư vấn chuyên sâu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Đường dẫn trang"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #f1f5f9",
          padding: "12px 20px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            fontSize: "13.5px",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }}
          >
            🏠 Trang chủ
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={onBack}
            style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }}
          >
            Góc phụ huynh
          </button>
          <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{article.title}</span>
        </div>
      </nav>

      {/* Main Article Container */}
      <main className="container" style={{ maxWidth: "860px", margin: "40px auto", padding: "0 20px" }}>
        <article
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            padding: "40px 36px",
            boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Article Header Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#15803d",
                background: "#dcfce7",
                border: "1px solid #bbf7d0",
                padding: "4px 12px",
                borderRadius: "999px",
              }}
            >
              🏷️ {article.category}
            </span>
            <span style={{ fontSize: "13px", color: "#64748b" }}>⏱️ {article.readTime} đọc</span>
            <span style={{ fontSize: "13px", color: "#64748b" }}>📅 Ngày đăng: {article.publishedDate}</span>
          </div>

          {/* Article Title */}
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: "1.3",
              letterSpacing: "-0.5px",
              marginBottom: "20px",
            }}
          >
            {article.title}
          </h1>

          {/* Author Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "24px",
              marginBottom: "28px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(37, 99, 255, 0.25)",
              }}
            >
              👩‍🏫
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                {article.author}
              </div>
              <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                Chuyên gia Giáo dục Đặc biệt • Trung tâm Hỗ trợ Trẻ tự kỷ Cô Hương
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.image && (
            <figure style={{ margin: "0 0 32px 0" }}>
              <div
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  background: "#f1f5f9",
                  boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.08)",
                }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  style={{
                    width: "100%",
                    maxHeight: "440px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <figcaption
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  fontStyle: "italic",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                Hình ảnh minh họa: Hoạt động can thiệp và tương tác phát triển kỹ năng cho trẻ
              </figcaption>
            </figure>
          )}

          {/* Lead Summary */}
          <div
            style={{
              background: "#f0fdf4",
              borderLeft: "4px solid #16a34a",
              padding: "18px 22px",
              borderRadius: "0 16px 16px 0",
              marginBottom: "32px",
              fontSize: "16px",
              lineHeight: "1.65",
              color: "#166534",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            {article.summary}
          </div>

          {/* Article Detailed Body (Rich HTML from CKEditor or Structured Sections) */}
          <div
            className="article-rich-content"
            style={{
              lineHeight: "1.85",
              fontSize: "16.5px",
              color: "#334155",
            }}
          >
            {article.htmlContent ? (
              <div
                dangerouslySetInnerHTML={{ __html: article.htmlContent }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              />
            ) : (
              article.content.map((sec, idx) => (
                <section key={idx} style={{ marginBottom: "28px" }}>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#0f172a",
                      marginTop: "24px",
                      marginBottom: "14px",
                    }}
                  >
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} style={{ marginBottom: "14px", lineHeight: "1.8" }}>
                      {para}
                    </p>
                  ))}
                  {sec.tips && sec.tips.length > 0 && (
                    <div
                      style={{
                        background: "#f8fafc",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "18px 22px",
                        marginTop: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <strong style={{ display: "block", color: "#4338ca", marginBottom: "8px", fontSize: "15px" }}>
                        💡 Hướng dẫn thực hành cho ba mẹ:
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {sec.tips.map((tip, tIdx) => (
                          <li key={tIdx} style={{ fontSize: "15px", color: "#334155" }}>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ))
            )}
          </div>

          {/* Social Share & Action Bar */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>Chia sẻ bài viết:</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="button button--secondary"
                style={{ padding: "6px 14px", minHeight: "34px", fontSize: "13px" }}
              >
                {copied ? "✓ Đã sao chép liên kết" : "🔗 Sao chép liên kết"}
              </button>
              <button
                type="button"
                onClick={handleShareZalo}
                className="button button--secondary"
                style={{ padding: "6px 14px", minHeight: "34px", fontSize: "13px", color: "#0068ff" }}
              >
                💬 Zalo
              </button>
              <button
                type="button"
                onClick={handleShareFacebook}
                className="button button--secondary"
                style={{ padding: "6px 14px", minHeight: "34px", fontSize: "13px", color: "#1877f2" }}
              >
                📘 Facebook
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="button button--secondary"
                style={{ padding: "6px 14px", minHeight: "34px", fontSize: "13px" }}
              >
                🖨️ In bài
              </button>
            </div>

            <button
              type="button"
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ← Trở về danh sách bài viết
            </button>
          </div>

          {/* Bottom Consultation Banner */}
          <div
            style={{
              marginTop: "36px",
              background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
              border: "1.5px solid #bfdbfe",
              borderRadius: "20px",
              padding: "28px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌱</div>
            <h3 style={{ margin: "0 0 10px", color: "#1e3a8a", fontSize: "20px", fontWeight: "800" }}>
              Ba mẹ cần tư vấn trực tiếp cho trường hợp của con?
            </h3>
            <p style={{ margin: "0 auto 20px", maxWidth: "600px", color: "#334155", fontSize: "14.5px", lineHeight: "1.6" }}>
              Đừng ngần ngại liên hệ với <strong>Cô Hương</strong> tại <em>TDP Duyên Phúc, xã Hưng Hà, Tỉnh Hưng Yên</em>. Chúng tôi luôn sẵn lòng lắng nghe, đánh giá phát triển và xây dựng lộ trình can thiệp IEP cá nhân hóa tốt nhất cho con.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="button button--primary"
                onClick={() => onConsult(article.title)}
                style={{ minHeight: "46px", padding: "10px 24px", fontSize: "15px" }}
              >
                💬 Đăng ký tư vấn miễn phí cho con
              </button>
              <a
                className="button button--secondary"
                href="tel:0962903942"
                style={{ minHeight: "46px", padding: "10px 24px", fontSize: "15px" }}
              >
                📞 Hotline: 096 290 3942
              </a>
            </div>
          </div>
        </article>

        {/* =========================================================================
            MỤC "CÁC BÀI VIẾT LIÊN QUAN" (RELATED ARTICLES)
            ========================================================================= */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section" style={{ marginTop: "48px", marginBottom: "60px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>
                  📚 Các bài viết liên quan có thể bạn quan tâm
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Kiến thức y khoa và kinh nghiệm thực hành hữu ích cho phụ huynh có con chậm nói, tự kỷ
                </p>
              </div>
            </div>

            <div
              className="related-articles-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  className="related-article-card"
                  onClick={() => onSelectArticle(rel)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px -4px rgba(37,99,255,0.12)";
                    e.currentTarget.style.borderColor = "#93c5fd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{ height: "150px", overflow: "hidden", background: "#f1f5f9" }}>
                    <img
                      src={rel.image}
                      alt={rel.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: "700",
                          color: "#166534",
                          background: "#dcfce7",
                          padding: "2px 8px",
                          borderRadius: "999px",
                        }}
                      >
                        {rel.category}
                      </span>
                      <span style={{ fontSize: "11.5px", color: "#64748b" }}>⏱️ {rel.readTime}</span>
                    </div>

                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#0f172a",
                        lineHeight: "1.4",
                        margin: "0 0 8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {rel.title}
                    </h4>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        lineHeight: "1.5",
                        margin: "0 0 14px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {rel.summary}
                    </p>

                    <span
                      style={{
                        marginTop: "auto",
                        fontSize: "13.5px",
                        fontWeight: "700",
                        color: "#2563eb",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Đọc bài viết →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
