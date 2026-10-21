import React, { useEffect, useState } from "react";

export type LightboxImage = {
  src: string;
  alt?: string;
  caption: string;
};

type LightboxModalProps = {
  isOpen: boolean;
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function LightboxModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (diff > 40) {
      // Vuốt sang phải -> Ảnh trước
      onNavigate((currentIndex - 1 + images.length) % images.length);
    } else if (diff < -40) {
      // Vuốt sang trái -> Ảnh tiếp theo
      onNavigate((currentIndex + 1) % images.length);
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Thư viện ảnh không gian học tập"
    >
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="lightbox-header">
          <div className="lightbox-counter">
            <span className="lightbox-tag">Không gian cơ sở vật chất</span>
            <span className="lightbox-index">
              Ảnh {currentIndex + 1} / {images.length}
            </span>
          </div>
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={onClose}
            aria-label="Đóng thư viện ảnh"
            title="Đóng (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Main Stage */}
        <div
          className="lightbox-stage"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn lightbox-nav-btn--prev"
              onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
              aria-label="Ảnh trước đó"
              title="Ảnh trước (Mũi tên trái)"
            >
              ‹
            </button>
          )}

          <div className="lightbox-image-wrap">
            <img
              src={current.src}
              alt={current.alt || current.caption}
              className="lightbox-main-img"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn lightbox-nav-btn--next"
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              aria-label="Ảnh tiếp theo"
              title="Ảnh tiếp theo (Mũi tên phải)"
            >
              ›
            </button>
          )}
        </div>

        {/* Bottom Caption & Thumbnails */}
        <div className="lightbox-footer">
          <p className="lightbox-caption">{current.caption}</p>
          <div className="lightbox-thumbnails">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`lightbox-thumb-btn ${idx === currentIndex ? "lightbox-thumb-btn--active" : ""}`}
                onClick={() => onNavigate(idx)}
                aria-label={`Xem ảnh ${idx + 1}`}
              >
                <img src={img.src} alt={img.caption} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LightboxModal;
