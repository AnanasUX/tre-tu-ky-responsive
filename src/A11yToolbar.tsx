import React, { useState, useEffect } from "react";

export function A11yToolbar() {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1: small, 0: default, 1: large, 2: extra large
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeLevel === 1) {
      root.style.setProperty("--font-size-scale", "1.1");
    } else if (fontSizeLevel === 2) {
      root.style.setProperty("--font-size-scale", "1.22");
    } else if (fontSizeLevel === -1) {
      root.style.setProperty("--font-size-scale", "0.92");
    } else {
      root.style.removeProperty("--font-size-scale");
    }

    if (highContrast) {
      root.classList.add("high-contrast-mode");
    } else {
      root.classList.remove("high-contrast-mode");
    }
  }, [fontSizeLevel, highContrast]);

  return (
    <div className="a11y-toolbar-container">
      {isOpen ? (
        <div className="a11y-panel">
          <div className="a11y-panel__header">
            <span>👓 Hỗ trợ xem trang</span>
            <button
              type="button"
              className="a11y-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng bảng trợ năng"
            >
              ×
            </button>
          </div>
          <div className="a11y-panel__body">
            <div className="a11y-row">
              <span className="a11y-label">Cỡ chữ:</span>
              <div className="a11y-btn-group">
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === -1 ? "active" : ""}`}
                  onClick={() => setFontSizeLevel(-1)}
                  title="Chữ nhỏ"
                >
                  A-
                </button>
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === 0 ? "active" : ""}`}
                  onClick={() => setFontSizeLevel(0)}
                  title="Mặc định"
                >
                  A
                </button>
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === 1 ? "active" : ""}`}
                  onClick={() => setFontSizeLevel(1)}
                  title="Chữ to"
                >
                  A+
                </button>
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === 2 ? "active" : ""}`}
                  onClick={() => setFontSizeLevel(2)}
                  title="Chữ rất to"
                >
                  A++
                </button>
              </div>
            </div>

            <div className="a11y-row">
              <span className="a11y-label">Tương phản cao:</span>
              <button
                type="button"
                className={`a11y-toggle-btn ${highContrast ? "active" : ""}`}
                onClick={() => setHighContrast(!highContrast)}
              >
                {highContrast ? "Đang bật ☀️" : "Tắt 🌙"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="a11y-trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Tùy chỉnh cỡ chữ & tương phản trang web"
          aria-label="Tùy chỉnh hỗ trợ xem trang"
        >
          👓
        </button>
      )}
    </div>
  );
}
