import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { trackLandingPageAccess } from './analytics/accessLogger'

// =========================================================================
// KHÓA PHÓNG TO / THU NHỎ MÀN HÌNH CỐ ĐỊNH (FIXED ZOOM LOCK 100%)
// Không cho phép phóng to, thu nhỏ trang web trên cả Mobile và Desktop
// =========================================================================
if (typeof window !== 'undefined') {
  // 1. Chặn gesture pinch zoom trên Safari iOS
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false })
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false })
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false })

  // 2. Chặn thao tác chạm đa điểm (pinch zoom) trên Android & iOS
  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault()
      }
    },
    { passive: false }
  )

  // 3. Chặn phóng to khi nhấp đúp (Double-tap to zoom)
  let lastTouchEnd = 0
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    },
    { passive: false }
  )

  // 4. Chặn thao tác Ctrl + lăn chuột (Ctrl + Wheel) trên Desktop
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    },
    { passive: false }
  )

  // 5. Chặn phím tắt phóng to/thu nhỏ trên bàn phím (Ctrl +, Ctrl -, Ctrl 0)
  window.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0' || e.key === '_')
    ) {
      e.preventDefault()
    }
  })

  // Khởi chạy ghi nhận nhật ký truy cập (kèm IP, Vị trí và Chiến dịch Zalo)
  trackLandingPageAccess()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
