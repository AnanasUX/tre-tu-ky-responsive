import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  fetchCloudConfig,
  initialLandingPageConfig,
  LandingPageConfig,
  LandingSection,
  loadLandingConfig,
  STORAGE_KEY,
} from "./landingPage"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { getHeatmapTracker } from "./analytics/heatmapTracker"
import { LightboxModal, type LightboxImage } from "./LightboxModal"
import { TeacherDetailModal, type TeacherData, getTeacherExtraDetails } from "./TeacherDetailModal"
import { LiveChatWidget } from "./LiveChatWidget"
import { DevelopmentalScreener } from "./DevelopmentalScreener"
import { sendLeadToGoogleSheets } from "./services/googleSheetsService"

const LandingConfigContext = createContext<LandingPageConfig>(initialLandingPageConfig)
const useConfig = () => useContext(LandingConfigContext)

type IconName =
  | "chat"
  | "heart"
  | "shield"
  | "speech"
  | "skill"
  | "leaf"
  | "light"
  | "balance"
  | "connect"
  | "arrow"
  | "arrowUp"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "profile"
  | "facebook"

const iconPaths: Record<IconName, ReactNode> = {
  facebook: (
    <path
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"
      fill="currentColor"
    />
  ),
  chat: <path d="M7 17.5 3.5 20v-4A8 8 0 1 1 7 17.5Z" />,
  heart: (
    <path d="M20.8 5.8c0 5.5-8.8 11.4-8.8 11.4S3.2 11.3 3.2 5.8A4.5 4.5 0 0 1 12 4.4a4.5 4.5 0 0 1 8.8 1.4Z" />
  ),
  shield: (
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4" />
  ),
  speech: (
    <>
      <path d="M5 5h14v10H9l-4 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  skill: (
    <>
      <path d="M4 18V8l4-3 4 3v10M12 18V6l4-3 4 3v12" />
      <path d="M2 20h20" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c9 0 14-5 14-14C10 5 5 10 5 19Z" />
      <path d="M5 19 15 9" />
    </>
  ),
  light: (
    <>
      <path d="M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0c-1 .8-1.5 1.7-1.5 2.5h-5C9.5 15.7 9 14.8 8 14Z" />
    </>
  ),
  balance: (
    <>
      <path d="M12 3v18M5 6h14M3 16l3-7 3 7a4 4 0 0 1-6 0ZM15 16l3-7 3 7a4 4 0 0 1-6 0Z" />
    </>
  ),
  connect: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="7" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="m8.5 7.5 7 0M8 8.5l3 6.5M16.5 10l-3 5" />
    </>
  ),
  arrow: <path d="m9 18 6-6-6-6" />,
  arrowUp: (
    <path
      d="M12 19V5m-7 7 7-7 7 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3h3l1.2 5-2.2 1.5a15 15 0 0 0 6 6l1.5-2.2 5 1.2v3c0 2-1.5 3.5-3.5 3.5C9.5 21 3 14.5 3 6.5 3 4.5 4.5 3 6.5 3Z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
}

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  const config = useConfig()
  return (
    <div className={`logo ${light ? "logo--light" : ""}`}>
      <span className="logo__mark" aria-hidden="true" />
      <span className="logo__copy">
        <strong>{config.siteName || "Lớp Can Thiệp Chuyên Biệt Cô Hương"}</strong>
      </span>
    </div>
  )
}

function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  heatmapId,
}: {
  children: ReactNode
  variant?: "primary" | "secondary"
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
  heatmapId?: string
}) {
  return (
    <button
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      data-heatmap-id={heatmapId}
    >
      {children}
    </button>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description: string
}) {
  return (
    <div className="section-title reveal">
      <h2>{title}</h2>
      <p>{description}</p>
      {eyebrow && <span className="section-title__note">{eyebrow}</span>}
    </div>
  )
}

function getSection(config: LandingPageConfig, id: string): LandingSection | undefined {
  return config.sections.find((s) => s.id === id)
}

/**
 * Kiểm tra xem người dùng có đang truy cập từ đường link chiến dịch Zalo:
 * https://ananasux.github.io/tre-tu-ky-responsive/?zarsrc=30&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo#resources
 * Khi truy cập bằng link này, mục "Đội ngũ" sẽ tự động được ẩn đi để tối ưu luồng phễu tài nguyên Zalo.
 * Đối với người dùng thông thường truy cập trang web, mục "Đội ngũ" vẫn hiển thị đầy đủ và tương tác bình thường.
 */
export function isZaloCampaignResourcesLanding(): boolean {
  if (typeof window === "undefined") return false
  try {
    const search = window.location.search.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    const href = window.location.href.toLowerCase()

    const hasZaloParams =
      search.includes("zarsrc=30") ||
      (search.includes("utm_source=zalo") && search.includes("utm_campaign=zalo")) ||
      href.includes("zarsrc=30")

    // Chỉ kích hoạt luồng phễu tài nguyên khi URL có định hướng rõ ràng tới mục resources
    const isTargetingResources =
      hash.includes("resources") || search.includes("resources")

    return hasZaloParams && isTargetingResources
  } catch {
    return false
  }
}

function Header({
  scrolled,
  activeSection = "about",
  onNavigate,
  hideTeam = false,
}: {
  scrolled: boolean
  activeSection?: string
  onNavigate?: (id: string) => void
  hideTeam?: boolean
}) {
  const config = useConfig()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open])

  const scrollToHash = (hash: string) => {
    setOpen(false)
    const cleanId = hash.replace("#", "")
    if (onNavigate) {
      onNavigate(cleanId === "top" ? "about" : cleanId)
    }

    try {
      window.history.pushState(null, "", hash)
    } catch {}

    const lenis = (window as any).__lenis

    // Mục "Giới thiệu" (#about) và Trang chủ (#top) luôn cuộn êm lên đầu trang
    if (hash === "#about" || hash === "#top") {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.1, immediate: false })
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      return
    }

    const targetEl = document.querySelector(hash) as HTMLElement | null

    if (lenis && targetEl) {
      lenis.scrollTo(targetEl, { offset: -74, duration: 1.1, immediate: false })
    } else if (targetEl) {
      const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 74
      window.scrollTo({ top: topPos, behavior: "smooth" })
    }
  }

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="container header__bar">
        <a
          className="brand-link"
          href="#top"
          aria-label="Về trang chủ"
          onClick={(e) => {
            e.preventDefault()
            if (onNavigate) {
              onNavigate("about")
            }
            try {
              window.history.pushState(null, "", "#about")
            } catch {}
            const lenis = (window as any).__lenis
            if (lenis) lenis.scrollTo(0, { duration: 1.2 })
            else window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          <Logo />
        </a>

        <nav
          className={`nav ${open ? "nav--open" : ""}`}
          aria-label="Điều hướng chính"
        >
          {(hideTeam ? config.navigation.filter((item) => item.path !== "#team") : config.navigation).map((item, index) => {
            const sectionId = item.path.replace("#", "")
            const isActive = activeSection === sectionId || (!activeSection && index === 0)
            return (
              <a
                key={`${item.path}-${index}`}
                className={isActive ? "nav__active" : ""}
                href={item.path}
                onClick={(e) => {
                  if (item.path.startsWith("#")) {
                    e.preventDefault()
                    scrollToHash(item.path)
                  } else {
                    setOpen(false)
                  }
                }}
              >
                {item.label}
              </a>
            )
          })}
          <a
            className="button button--primary nav__cta"
            href="#contact"
            data-heatmap-id="cta-nav-consult"
            onClick={(e) => {
              e.preventDefault()
              scrollToHash("#contact")
            }}
          >
            {config.consultationLabel || "Tư vấn ngay"}
          </a>
        </nav>

        <a
          className="button button--primary header__cta"
          href="#contact"
          data-heatmap-id="cta-header-consult"
          onClick={(e) => {
            e.preventDefault()
            scrollToHash("#contact")
          }}
        >
          {config.consultationLabel || "Tư vấn ngay"}
        </a>

        <button
          aria-expanded={open}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          className={`menu-button ${open ? "menu-button--open" : ""}`}
          onClick={() => setOpen(!open)}
          ref={menuButtonRef}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  const config = useConfig()
  const section = getSection(config, "hero")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Thiết kế một hành trình phù hợp với trẻ"
  const title = section?.title ?? "Tôn trọng từng nhịp phát triển, đồng hành cùng gia đình"
  const description =
    section?.description ??
    "Không gian kết nối dành cho trẻ và phụ huynh, nơi mỗi khác biệt được lắng nghe, mỗi bước tiến được ghi nhận, và hành trình phát triển được xây dựng bằng sự thấu hiểu."
  const primaryAction = section?.primaryAction ?? "Đăng ký tư vấn"
  const secondaryAction = section?.secondaryAction ?? "Tìm hiểu phương pháp"
  const image = section?.image && section.image.startsWith("./") ? section.image : "./images/classroom-main.jpg"

  return (
    <main className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__content reveal">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="hero__actions">
            <a
              className="button button--primary"
              href="#contact"
              data-heatmap-id="cta-hero-consult"
              onClick={(e) => {
                e.preventDefault()
                const lenis = (window as any).__lenis
                if (lenis) lenis.scrollTo("#contact", { offset: -72, duration: 1.2 })
                else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {primaryAction}
            </a>
            <a
              className="button button--secondary"
              href="#process"
              data-heatmap-id="cta-hero-process"
              onClick={(e) => {
                e.preventDefault()
                const lenis = (window as any).__lenis
                if (lenis) lenis.scrollTo("#process", { offset: -72, duration: 1.2 })
                else document.querySelector("#process")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {secondaryAction}
            </a>
          </div>
          <div className="hero__notes">
            <span>Tôn trọng khác biệt</span>
            <span>Minh bạch mục tiêu</span>
            <span>Đồng hành cùng gia đình</span>
          </div>
        </div>
        <figure
          className="hero__visual reveal reveal-delay-2"
          onClick={() => {
            const gallerySection = document.querySelector("#gallery");
            if (gallerySection) gallerySection.scrollIntoView({ behavior: "smooth" });
          }}
          style={{ cursor: "pointer" }}
          title="Bấm để xem hình ảnh không gian phòng học & cơ sở vật chất"
        >
          <img
            src={image}
            alt="Không gian học tập ấm áp với vật liệu gỗ tự nhiên"
          />
          <figcaption>
            🔍 Bấm để khám phá cơ sở vật chất phòng học của trung tâm
          </figcaption>
        </figure>
      </div>
    </main>
  )
}

function Mission() {
  const config = useConfig()
  const section = getSection(config, "mission")
  if (section && !section.enabled) return null

  const title = section?.title ?? "Sứ mệnh và môi trường hỗ trợ"
  const description =
    section?.description ??
    "Chúng tôi xây dựng sự an tâm trước, hiểu nhu cầu trước, rồi mới lựa chọn hướng hỗ trợ. Thiết kế dựa trên thế mạnh của trẻ và khả năng ứng dụng trong chính nhịp sống gia đình."

  const defaultCards = [
    {
      icon: "chat" as const,
      title: "Tôn trọng từng nhịp phát triển",
      text: "Không so sánh, không thúc ép. Mỗi trẻ có một cách cảm nhận và tốc độ trưởng thành riêng.",
    },
    {
      icon: "heart" as const,
      title: "Phối hợp chặt chẽ với gia đình",
      text: "Gia đình luôn là người đồng hành quan trọng trong mọi mục tiêu và quyết định.",
    },
    {
      icon: "shield" as const,
      title: "An toàn và kín đáo",
      text: "Thông tin được tôn trọng, trao đổi minh bạch và chỉ sử dụng cho mục đích hỗ trợ.",
    },
  ]

  const icons: IconName[] = ["chat", "heart", "shield", "leaf", "light"]
  const cards = section?.items && section.items.length > 0
    ? section.items.map((item, idx) => ({
        icon: icons[idx % icons.length],
        title: item.title,
        text: item.description ?? "",
      }))
    : defaultCards

  return (
    <section className="section section--tint" id="about">
      <div className="container">
        <SectionTitle title={title} description={description} />
        <div className="mission-grid">
          {cards.map((card, idx) => (
            <article className={`mission-card reveal reveal-delay-${(idx % 3) + 1}`} key={`${card.title}-${idx}`}>
              <span className="icon-box">
                <Icon name={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Areas() {
  const config = useConfig()
  const section = getSection(config, "support")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Hiểu trẻ để lựa chọn hướng đồng hành phù hợp"
  const title = section?.title ?? "Lĩnh vực hỗ trợ tham khảo"
  const description =
    section?.description ??
    "Nội dung dưới đây chỉ mang tính tham khảo. Trong trao đổi ban đầu, chúng tôi cùng gia đình nhìn vào nhu cầu thực tế thay vì gắn nhãn cho trẻ."

  const defaultSupportAreas = [
    { icon: "speech" as const, title: "Giao tiếp / Ngôn ngữ", text: "Trẻ chậm nói, khó diễn đạt, ít tương tác hoặc cần phát triển kỹ năng giao tiếp." },
    { icon: "skill" as const, title: "Kỹ năng xã hội", text: "Tăng khả năng kết nối, hợp tác, làm việc nhóm và thích nghi trong môi trường mới." },
    { icon: "leaf" as const, title: "Tự lập", text: "Hỗ trợ trẻ hình thành thói quen, kỹ năng tự chăm sóc và chủ động trong sinh hoạt." },
    { icon: "light" as const, title: "Nhận thức / Học tập", text: "Khơi gợi hứng thú học hỏi, tăng tập trung và xây dựng chiến lược học phù hợp." },
    { icon: "balance" as const, title: "Điều hòa cảm xúc", text: "Nhận biết, gọi tên và thể hiện cảm xúc theo cách an toàn, tích cực." },
    { icon: "connect" as const, title: "Học qua chơi", text: "Thiết kế hoạt động vui chơi có mục tiêu, phù hợp nhịp độ và sở thích của trẻ." },
  ]

  const areaIcons: IconName[] = ["speech", "skill", "leaf", "light", "balance", "connect"]
  const areas = section?.items && section.items.length > 0
    ? section.items.map((item, idx) => ({
        icon: areaIcons[idx % areaIcons.length],
        title: item.title,
        text: item.description ?? "",
      }))
    : defaultSupportAreas

  return (
    <section className="section" id="areas">
      <div className="container">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="areas-grid">
          {areas.map((area, index) => (
            <article className={`area-card reveal reveal-delay-${(index % 3) + 1}`} key={`${area.title}-${index}`}>
              <span className={`icon-box icon-box--c${(index % 6) + 1}`}>
                <Icon name={area.icon} />
              </span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>

        {/* Mini CTA: Đón đầu phụ huynh giữa chặng sau Khối 3 (Lĩnh vực can thiệp) */}
        <div className="areas-mini-cta reveal reveal-delay-2">
          <div className="areas-mini-cta__content">
            <div className="areas-mini-cta__badge">
              <span>⚡ Tư vấn can thiệp nhanh 1:1</span>
            </div>
            <h3>Băn khoăn con đang ở giai đoạn nào trong các lĩnh vực trên?</h3>
            <p>
              Giai đoạn 18 – 36 tháng là thời gian vàng không thể lấy lại. Chỉ 15 phút trao đổi cùng Cô Hương để nhận định hướng can thiệp sớm chính xác:
            </p>
            <ul className="areas-mini-cta__list">
              <li>
                <span className="areas-mini-cta__check">✓</span>
                <span><strong>Đánh giá phát triển 1:1 miễn phí</strong> qua thang đo chuẩn Denver II & M-CHAT</span>
              </li>
              <li>
                <span className="areas-mini-cta__check">✓</span>
                <span><strong>Xây dựng kế hoạch can thiệp cá nhân (IEP)</strong> đúng với nhịp phát triển của con</span>
              </li>
              <li>
                <span className="areas-mini-cta__check">✓</span>
                <span><strong>Hướng dẫn bài tập tương tác, kích hoạt ngôn ngữ tại nhà</strong> cho gia đình</span>
              </li>
            </ul>
          </div>
          <div className="areas-mini-cta__actions">
            <a
              href="#screener"
              className="button button--primary"
              data-heatmap-id="cta-areas-mini-screener"
              onClick={(e) => {
                e.preventDefault();
                const screenerEl = document.querySelector("#screener");
                const lenis = (window as any).__lenis;
                if (lenis && screenerEl) {
                  lenis.scrollTo(screenerEl, { offset: -74, duration: 1.1 });
                } else if (screenerEl) {
                  screenerEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{ background: "linear-gradient(135deg, #50008b 0%, #7c3aed 100%)", border: "none" }}
            >
              🧪 Làm trắc nghiệm sàng lọc 60s
            </a>
            <a
              href="https://zalo.me/0962903942"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--zalo-highlight"
              data-heatmap-id="cta-areas-mini-zalo"
            >
              💬 Nhắn Zalo Cô Hương ngay
            </a>
            <a
              href="#contact"
              className="button button--secondary"
              data-heatmap-id="cta-areas-mini-form"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              📅 Đăng ký đánh giá 1:1
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const config = useConfig()
  const section = getSection(config, "process")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Một hành trình rõ ràng, linh hoạt và có thể điều chỉnh"
  const title = section?.title ?? "Quy trình tham khảo"
  const description =
    section?.description ??
    "Gia đình được trao đổi xuyên suốt. Chúng tôi bắt đầu từ nhu cầu thực tế, đồng thuận mục tiêu và theo dõi những thay đổi nhỏ nhất."

  const defaultSteps = [
    { number: "01", title: "Tiếp nhận thông tin gia đình", text: "Lắng nghe nhu cầu, bối cảnh và những băn khoăn ban đầu của phụ huynh." },
    { number: "02", title: "Trao đổi nhu cầu", text: "Cùng gia đình xác định điều cần ưu tiên và kết quả mong đợi." },
    { number: "03", title: "Xây dựng mục tiêu", text: "Lựa chọn mục tiêu thực tế, có thể theo dõi và phù hợp với trẻ." },
    { number: "04", title: "Thực hiện / Theo dõi", text: "Đồng hành qua hoạt động, ghi nhận tiến triển và trao đổi thường xuyên." },
    { number: "05", title: "Trao đổi định kỳ", text: "Cập nhật, điều chỉnh kế hoạch và thống nhất bước tiếp theo cùng gia đình." },
  ]

  const steps = section?.items && section.items.length > 0
    ? section.items.map((item, idx) => ({
        number: item.meta || String(idx + 1).padStart(2, "0"),
        title: item.title,
        text: item.description ?? "",
      }))
    : defaultSteps

  return (
    <section className="section section--soft" id="process">
      <div className="container">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="process-grid">
          {steps.map((step, index) => (
            <article className={`process-card reveal reveal-delay-${(index % 5) + 1}`} key={`${step.number}-${index}`}>
              <span className={`step-number step-number--${(index % 5) + 1}`}>
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Team({ hideTeam = false }: { hideTeam?: boolean }) {
  const config = useConfig()
  const section = getSection(config, "team")
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null)

  if (hideTeam) return null
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Chuyên môn cao · Tận tâm · Giàu tình thương"
  const title = section?.title ?? "Đội ngũ chuyên gia & giáo viên tận tâm"
  const description =
    section?.description ??
    "Được đào tạo bài bản chuyên sâu về Tâm lý học, Giáo dục Đặc biệt và Âm ngữ trị liệu, luôn kiên nhẫn và đồng hành bằng cả trái tim."

  const defaultTeam = [
    {
      name: "ThS. Hoàng Thị Hương",
      role: "Giám đốc chuyên môn • ThS Tâm lý học lâm sàng",
      bio: "Hơn 10 năm kinh nghiệm trong công tác đánh giá, chẩn đoán và thiết kế chương trình can thiệp sớm cho trẻ tự kỷ, chậm phát triển.",
      image: "",
    },
    {
      name: "CN. Nguyễn Thu Trang",
      role: "Chuyên viên Âm ngữ trị liệu",
      bio: "Tốt nghiệp Đại học Sư phạm Hà Nội chuyên ngành Giáo dục Đặc biệt, sở hữu chứng chỉ quốc tế về trị liệu ngôn ngữ và phát triển giao tiếp.",
      image: "",
    },
    {
      name: "CN. Lê Hoàng Minh",
      role: "Chuyên viên Điều hòa Cảm giác (OT)",
      bio: "Chuyên sâu về trị liệu tích hợp giác quan, vận động chức năng và thiết kế môi trường học tập an toàn, thân thiện cho trẻ.",
      image: "",
    },
    {
      name: "Cô Vũ Mai Anh",
      role: "Giáo viên Can thiệp sớm & Tiền tiểu học",
      bio: "Giàu kinh nghiệm trong việc xây dựng thói quen tự lập, điều hòa cảm xúc hành vi và chuẩn bị tâm thế vững vàng vào lớp 1 cho trẻ.",
      image: "",
    },
  ]

  const members =
    section?.items && section.items.length > 0
      ? section.items.map((item) => ({
          name: item.title,
          role: item.meta || "Chuyên môn / vai trò",
          bio: item.description ?? "",
          image: item.image,
        }))
      : defaultTeam

  const handleTeacherClick = (item: { name: string; role: string; bio: string; image?: string }) => {
    setSelectedTeacher(getTeacherExtraDetails(item))
  }

  const handleConsultTeacher = (teacherName: string) => {
    setSelectedTeacher(null)
    const contactEl = document.querySelector("#contact")
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => {
        const textarea = document.querySelector("#message") as HTMLTextAreaElement
        if (textarea) {
          textarea.value = `Gia đình mong muốn được đặt lịch tư vấn và đánh giá phát triển trực tiếp cùng Cô ${teacherName}.`
          textarea.focus()
        }
      }, 500)
    }
  }

  return (
    <section className="section section--team" id="team">
      <div className="container">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="team-grid">
          {members.map((item, index) => (
            <article
              className={`profile-card profile-card--interactive team-card reveal reveal-delay-${(index % 4) + 1}`}
              key={`${item.name}-${index}`}
              onClick={() => handleTeacherClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleTeacherClick(item)
                }
              }}
              title={`Bấm để xem bằng cấp và hồ sơ chuyên môn của ${item.name}`}
            >
              <div className="profile-card__portrait">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="profile-card__placeholder" aria-hidden="true">
                    <Icon name="profile" size={52} />
                    <span>{item.name}</span>
                  </div>
                )}
                <span className="profile-card__inspect-badge">
                  <span>🔍 Xem hồ sơ & bằng cấp</span>
                </span>
              </div>
              <div className="profile-card__content">
                <h3>{item.name}</h3>
                <span className="profile-card__role">{item.role}</span>
                <p>{item.bio}</p>
                <div className="profile-card__footer-pill">
                  <span className="status-label">Chuyên gia chính thức</span>
                  <span className="profile-card__view-link">Xem hồ sơ ↗</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Nút phụ trợ Zalo đặt ngay chân khối Đội ngũ (Tối ưu phễu chuyển đổi Zalo Campaign) */}
        <div className="zalo-direct-cta-card reveal reveal-delay-2">
          <div className="zalo-direct-cta-card__badge">
            <Icon name="shield" size={15} />
            <span>Cam kết bảo mật 100% thông tin gia đình</span>
          </div>
          <p>Ba mẹ muốn trao đổi riêng tư về tình trạng của con với Cô Hương?</p>
          <a
            href="https://zalo.me/0962903942"
            className="btn-zalo-direct"
            target="_blank"
            rel="noopener noreferrer"
            data-heatmap-id="cta-team-zalo-direct"
          >
            <span>Chat Zalo tư vấn riêng tư với Cô Hương (096 290 3942)</span>
          </a>
        </div>

        {/* Contextual Inline CTA & Cam kết Bảo mật */}
        <div className="team-inline-cta-card reveal">
          <div className="team-inline-cta-header">
            <span className="team-inline-cta-shield">
              <Icon name="shield" size={16} />
              <span>Cam kết bảo mật 100% hồ sơ & hình ảnh của trẻ</span>
            </span>
            <h3>Ba mẹ muốn nhận tư vấn định hướng trực tiếp từ các Cô?</h3>
            <p>
              Mỗi biểu hiện nhỏ của con đều mang ý nghĩa quan trọng trong giai đoạn phát triển vàng. Đừng ngần ngại kết nối ngay để được Cô Hương và ban chuyên môn lắng nghe, chia sẻ và đề xuất lộ trình phù hợp nhất.
            </p>
          </div>
          <div className="team-inline-cta-actions">
            <a
              href="https://zalo.me/0962903942"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--zalo-highlight"
              data-heatmap-id="cta-team-inline-zalo"
            >
              💬 Nhắn tin Zalo với Cô Hương ngay
            </a>
            <a
              href="#contact"
              className="button button--secondary-outline"
              data-heatmap-id="cta-team-inline-form"
              onClick={(e) => {
                e.preventDefault()
                const lenis = (window as any).__lenis
                if (lenis) lenis.scrollTo("#contact", { offset: -72, duration: 1.2 })
                else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              📅 Đặt lịch đánh giá phát triển miễn phí
            </a>
          </div>
          <div className="team-inline-cta-trust-tags">
            <span>⚡ Phản hồi Zalo trong vòng 3 - 5 phút (kể cả ngoài giờ & cuối tuần)</span>
            <span>•</span>
            <span>🔒 Tuyệt đối không chia sẻ thông tin cho bên thứ ba</span>
            <span>•</span>
            <span>⭐ Miễn phí 100% buổi trao đổi định hướng ban đầu</span>
          </div>
        </div>
      </div>

      {/* Teacher Detail Modal */}
      <TeacherDetailModal
        isOpen={selectedTeacher !== null}
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onConsult={handleConsultTeacher}
      />
    </section>
  )
}

function Space() {
  const config = useConfig()
  const section = getSection(config, "gallery")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (section && !section.enabled) return null

  const title = section?.title ?? "Không gian học tập an toàn & truyền cảm hứng"
  const description =
    section?.description ??
    "Hệ thống phòng học cá nhân, phòng vận động giác quan và khu vực kỹ năng được thiết kế tối ưu, ấm cúng, đầy đủ giáo cụ trực quan giúp trẻ thoải mái khám phá."

  const defaultGalleryImages: LightboxImage[] = [
    {
      src: "./images/classroom-main.jpg",
      caption: "Toàn cảnh phòng học sáng thoáng, ấm cúng với nội thất gỗ tự nhiên thân thiện",
      alt: "Toàn cảnh phòng học sáng, thoáng với nội thất gỗ",
    },
    {
      src: "./images/classroom-detail.jpg",
      caption: "Chi tiết góc học tập cá nhân với giáo cụ can thiệp trực quan phong phú",
      alt: "Chi tiết góc học tập với vật liệu tự nhiên",
    },
    {
      src: "./images/classroom-main.jpg",
      caption: "Khu vực tương tác và vận động giác quan an toàn, êm ái",
      alt: "Góc hoạt động trong phòng học",
    },
  ]

  const galleryImages: LightboxImage[] =
    section?.items && section.items.length > 0
      ? section.items.map((item, idx) => ({
          src: item.meta || (idx === 1 ? "./images/classroom-detail.jpg" : "./images/classroom-main.jpg"),
          caption: item.title || "Không gian học tập can thiệp chuyên sâu",
          alt: item.title,
        }))
      : defaultGalleryImages

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  return (
    <section className="section section--tint" id="gallery">
      <div className="container">
        <SectionTitle title={title} description={description} />
        <div className="gallery">
          <figure
            className="gallery__main gallery__figure--interactive gallery-item reveal"
            onClick={() => openLightbox(0)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                openLightbox(0)
              }
            }}
            title="Bấm để xem ảnh phóng to chi tiết"
          >
            <img
              src={galleryImages[0]?.src || "./images/classroom-main.jpg"}
              alt={galleryImages[0]?.alt || "Toàn cảnh phòng học"}
            />
            <span className="gallery__zoom-badge">🔍 Bấm để phóng to</span>
            <figcaption>{galleryImages[0]?.caption || "Phòng học sáng thoáng, ấm cúng"}</figcaption>
          </figure>

          {galleryImages.slice(1, 3).map((item, idx) => (
            <figure
              key={idx + 1}
              className="gallery__figure--interactive gallery-item"
              onClick={() => openLightbox(idx + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  openLightbox(idx + 1)
                }
              }}
              title="Bấm để xem ảnh phóng to chi tiết"
            >
              <img
                src={item.src}
                alt={item.alt || item.caption}
              />
              <span className="gallery__zoom-badge">🔍 Bấm để phóng to</span>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Gallery Modal (Solution 1) */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={galleryImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  )
}

function Resources() {
  const config = useConfig()
  const section = getSection(config, "resources")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Góc chia sẻ kiến thức hữu ích cho ba mẹ"
  const title = section?.title ?? "Tài nguyên cho phụ huynh"
  const description =
    section?.description ??
    "Các tiêu đề dưới đây là nội dung mẫu. Bài viết chỉ xuất hiện sau khi được xác minh nguồn và duyệt nội dung."

  const defaultResources = [
    { image: "./images/classroom-detail.jpg", tag: "Không gian", title: "5 cách bố trí góc học tập cho trẻ", text: "Gợi ý đơn giản để tạo một góc học tập yên tĩnh, thân thiện và dễ duy trì tại nhà." },
    { image: "./images/family-3.jpg", tag: "Đồng hành", title: "Kỹ năng chuyển giao về nhà", text: "Cùng trẻ tiếp tục kỹ năng đã học qua những hoạt động gần gũi hàng ngày." },
    { image: "./images/family-1.jpg", tag: "Cảm xúc", title: "Những điều nên trao đổi khi đón trẻ", text: "Một vài câu hỏi mở giúp cha mẹ hiểu ngày của con mà không tạo áp lực." },
  ]

  const fallbackImages = ["./images/classroom-detail.jpg", "./images/family-3.jpg", "./images/family-1.jpg"]
  const items = section?.items && section.items.length > 0
    ? section.items.map((item, idx) => ({
        image: fallbackImages[idx % fallbackImages.length],
        tag: item.meta || "Tài nguyên",
        title: item.title,
        text: item.description ?? "",
      }))
    : defaultResources

  return (
    <section className="section" id="resources">
      <div className="container">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="card-grid">
          {items.map((item, idx) => (
            <article className={`resource-card reveal reveal-delay-${(idx % 3) + 1}`} key={`${item.title}-${idx}`}>
              <div className="card-media">
                <img src={item.image} alt="Hình minh hoạ cho chủ đề bài viết" />
                <span className="media-note">Cẩm nang đồng hành</span>
              </div>
              <div>
                <span className="resource-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href="#contact" className="text-link">Đọc chi tiết & Đăng ký tư vấn →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const config = useConfig()
  const section = getSection(config, "faq")
  if (section && !section.enabled) return null

  const title = section?.title ?? "Câu hỏi thường gặp"
  const description =
    section?.description ??
    "Một vài thông tin cơ bản trước khi gia đình bắt đầu. Nếu chưa tìm thấy câu trả lời phù hợp, hãy gửi câu hỏi cho chúng tôi."

  const defaultFaqs: [string, string][] = [
    [
      "Tôi có thể trao đổi với Cô Hương và giáo viên như thế nào?",
      "Ba mẹ được trao đổi trực tiếp 1:1 với Cô Hương và giáo viên phụ trách sau mỗi ca học, xem sổ theo dõi tiến bộ hằng ngày và trao đổi qua Zalo chuyên môn để đồng bộ phương pháp dạy con tại nhà."
    ],
    [
      "Phụ huynh có thể tham gia vào các buổi can thiệp của con không?",
      "Hoàn toàn có thể. Trung tâm khuyến khích ba mẹ tham gia quan sát và được hướng dẫn kỹ thuật tương tác Floortime/ABA trong các buổi can thiệp để tự tin tiếp tục đồng hành cùng con tại gia đình."
    ],
    [
      "Thời lượng mỗi ca học và lịch can thiệp được sắp xếp ra sao?",
      "Mỗi ca học cá nhân 1:1 kéo dài từ 45 – 60 phút. Trung tâm sắp xếp lịch học linh hoạt từ Thứ 2 đến Thứ 7 (có các ca sáng, chiều và ngoài giờ hành chính) để thuận tiện cho việc đưa đón của gia đình."
    ],
    [
      "Thông tin và hình ảnh của con được bảo mật như thế nào?",
      "Trung tâm cam kết bảo mật 100% hồ sơ đánh giá, video và hình ảnh của trẻ. Mọi dữ liệu chỉ phục vụ chuyên môn nội bộ và tuyệt đối không chia sẻ cho bên thứ ba."
    ],
    [
      "Buổi đánh giá phát triển ban đầu có mất phí không?",
      "Buổi đánh giá ban đầu kéo dài 60 phút hoàn toàn MIỄN PHÍ. Chuyên viên sẽ kiểm tra trực tiếp qua thang đo chuẩn quốc tế (Denver II, M-CHAT-R/F) và tư vấn lộ trình phù hợp nhất cho gia đình."
    ]
  ]

  const items: [string, string][] = section?.items && section.items.length > 0
    ? section.items.map((item) => [item.title, item.description ?? ""])
    : defaultFaqs

  const [active, setActive] = useState<number | null>(0)

  return (
    <section className="section section--lavender" id="faq">
      <div className="container">
        <SectionTitle title={title} description={description} />
        <div className="faq-list">
          {items.map(([question, answer], index) => (
            <article
              className={`faq-item ${active === index ? "faq-item--open" : ""}`}
              key={`${question}-${index}`}
            >
              <button
                aria-expanded={active === index}
                onClick={() => setActive(active === index ? null : index)}
                type="button"
              >
                <span>{question}</span>
                <span aria-hidden="true">{active === index ? "−" : "+"}</span>
              </button>
              <div className="faq-item__answer">
                <p>{answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const config = useConfig()
  const section = getSection(config, "contact")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Đồng hành cùng gia đình"
  const title = section?.title ?? "Đăng ký tư vấn & Đánh giá phát triển cho con"
  const description =
    section?.description ??
    "Mỗi đứa trẻ đều là một điều kỳ diệu với nhịp phát triển riêng. Hãy để lại thông tin để Cô Hương và chuyên viên tâm lý liên hệ lắng nghe, giải đáp băn khoăn và đề xuất lộ trình hỗ trợ phù hợp nhất cho con."
  const primaryAction = section?.primaryAction ?? "Đăng ký tư vấn ngay (Miễn phí)"

  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [consent, setConsent] = useState(true)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    const form = event.currentTarget
    const formData = new FormData(form)
    const lead = {
      id: "lead-" + Date.now(),
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      need: String(formData.get("need") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    }

    try {
      // 1. Tự động lưu trữ vào Cơ sở dữ liệu Google Trang tính (100% Miễn phí trọn đời)
      sendLeadToGoogleSheets(lead).catch((err) => console.warn("Google Sheets save error:", err));

      // 2. Lưu trữ dự phòng đám mây KVDB
      const url = "https://kvdb.io/RtALwN4JAnjEQUjqKLgAuk/consultation_leads"
      const res = await fetch(url, { cache: "no-store" })
      const leads = res.ok ? await res.json() : []
      leads.unshift(lead)
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leads),
      })
      try {
        const ch = new BroadcastChannel("aurora-leads-sync")
        ch.postMessage({ type: "new_lead", lead })
        ch.close()
      } catch {}
    } catch (err) {
      console.warn("Could not save consultation lead:", err)
    } finally {
      // Giữ phản hồi thị giác tối thiểu 1.5s để chống nhấp dồn dập (Rage clicks & Double submission)
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitting(false);
      setSent(true);
    }
  }

  const phone = config.phone || "096 290 3942"
  const address = config.address || "TDP Duyên Phúc, xã Hưng Hà, Tỉnh Thái Bình"

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__copy reveal">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          
          <div className="contact__info-list">
            <a className="contact__info-item" href={`tel:${phone.replace(/[^0-9]/g, "")}`}>
              <span className="contact__info-icon"><Icon name="phone" size={20} /></span>
              <div>
                <strong>Hotline & Zalo tư vấn</strong>
                <span>{phone} (Hỗ trợ 24/7)</span>
              </div>
            </a>
            <div className="contact__info-item">
              <span className="contact__info-icon"><Icon name="pin" size={20} /></span>
              <div>
                <strong>Địa chỉ cơ sở</strong>
                <span>{address}</span>
              </div>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-icon"><Icon name="clock" size={20} /></span>
              <div>
                <strong>Thời gian đón tiếp</strong>
                <span>Thứ 2 – Thứ 7: 07:30 – 17:30</span>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form reveal reveal-delay-2" onSubmit={submit}>
          {sent ? (
            <div className="form-success">
              <span className="icon-box" style={{ background: "#e8f8ec", color: "#2d9935" }}>
                <Icon name="heart" size={28} />
              </span>
              <h3>Đã tiếp nhận thông tin!</h3>
              <p>
                Cảm ơn Quý phụ huynh đã tin tưởng gửi gắm. Cô Hương và ban chuyên môn sẽ liên hệ lại trực tiếp qua số Zalo sớm nhất để đồng hành cùng gia đình.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <a className="button button--primary" href={`tel:${phone.replace(/[^0-9]/g, "")}`}>
                  Gọi ngay: {phone}
                </a>
                <Button onClick={() => setSent(false)} variant="secondary">
                  Gửi thêm yêu cầu
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="name">Họ tên phụ huynh <span style={{ color: "var(--primary)" }}>*</span></label>
                <input
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  required
                  autoComplete="name"
                  disabled={submitting}
                />
              </div>
              <div className="form-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label htmlFor="phone" style={{ margin: 0 }}>
                    Số Zalo liên hệ <span style={{ color: "var(--primary)" }}>*</span>
                  </label>
                  <span style={{ fontSize: "11.5px", color: "#16a34a", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    🔒 Cam kết bảo mật 100%
                  </span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  placeholder={phone ? `Ví dụ: ${phone}` : "Ví dụ: 096 290 3942"}
                  required
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9\s.-]*"
                  autoComplete="tel"
                  disabled={submitting}
                />
              </div>
              <div className="form-field">
                <label htmlFor="message">
                  Độ tuổi & Biểu hiện của con (chậm nói, khó giao tiếp, ăn vạ...) <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Ví dụ: Bé 2 tuổi rưỡi, chưa nói được từ đơn, gọi tên không quay đầu, hay đi nhón chân..."
                  rows={3}
                  disabled={submitting}
                />
                <input type="hidden" name="need" value="Can thiệp sớm & đánh giá phát triển" />
              </div>
              <label className="checkbox">
                <input
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  type="checkbox"
                  disabled={submitting}
                />
                <span>
                  Tôi đồng ý để trung tâm liên hệ tư vấn. Thông tin được cam kết bảo mật 100%.
                </span>
              </label>

              {/* Security Privacy Assurance Pill */}
              <div className="form-security-badge">
                <Icon name="shield" size={16} />
                <span>Bảo mật 100%: Trung tâm không chia sẻ dữ liệu và tuyệt đối không gọi làm phiền.</span>
              </div>

              {/* Optimistic Visual Feedback Button */}
              <Button disabled={!consent || submitting} type="submit" heatmapId="form-submit-consult">
                {submitting ? (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span className="spinner-inline" /> Đang gửi thông tin đến Cô Hương...
                  </span>
                ) : (
                  primaryAction
                )}
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

function Footer({ hideTeam = false }: { hideTeam?: boolean }) {
  const config = useConfig()
  const section = getSection(config, "footer")
  if (section && !section.enabled) return null

  const description =
    section?.description ??
    "Trang này chỉ là bản thiết kế tham khảo. Nội dung, hình ảnh, bài viết và thông tin liên hệ cần được trung tâm xác minh trước khi triển khai."

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <Logo light />
          <p>{description}</p>
        </div>
        <div>
          <h3>Khám phá</h3>
          <a href="#about">Giới thiệu</a>
          <a href="#areas">Lĩnh vực hỗ trợ</a>
          {!hideTeam && <a href="#team">Đội ngũ</a>}
          <a href="#resources">Tài nguyên</a>
        </div>
        <div>
          <h3>Hỗ trợ</h3>
          <a href="#resources">Góc phụ huynh</a>
          <a href="#faq">Câu hỏi thường gặp</a>
          <a href="#contact">Liên hệ</a>
          <span>Quyền riêng tư</span>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 Trung tâm Hỗ trợ Trẻ tự kỷ Cô Hương. Bảo lưu mọi quyền.</span>
        <span>{config.address || "TDP Duyên Phúc, xã Hưng Hà, Tỉnh Hưng Yên"} · {config.phone || "096 290 3942"}</span>
      </div>
    </footer>
  )
}


function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <div className="scroll-progress-container" aria-hidden="true">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}

function BackToTop({
  visible,
  onScrollToTop,
  position = "right",
}: {
  visible: boolean
  onScrollToTop: () => void
  position?: "right" | "left"
}) {
  return (
    <button
      aria-label="Cuộn lên đầu trang"
      className={`back-to-top ${visible ? "is-visible" : ""} ${position === "left" ? "back-to-top--left" : ""}`}
      onClick={onScrollToTop}
      type="button"
      data-heatmap-id="btn-back-to-top"
      title="Cuộn lên đầu trang"
    >
      <Icon name="arrowUp" size={24} />
    </button>
  )
}

function FloatingContactBar({
  phone,
  facebook,
  zalo,
  facebookIcon,
  zaloIcon,
  phoneIcon,
  buttonSize = 52,
  enableFacebook = true,
  enableZalo = true,
  enablePhone = true,
  enablePulse = true,
  position = "right",
  onOpenChat,
}: {
  phone?: string
  facebook?: string
  zalo?: string
  facebookIcon?: string
  zaloIcon?: string
  phoneIcon?: string
  buttonSize?: number
  enableFacebook?: boolean
  enableZalo?: boolean
  enablePhone?: boolean
  enablePulse?: boolean
  position?: "right" | "left"
  onOpenChat?: () => void
}) {
  const cleanPhone = (phone || "").replace(/[^0-9]/g, "") || "0962903942"

  let zaloLink = "https://zalo.me/0962903942"
  if (zalo && zalo.trim()) {
    const raw = zalo.trim()
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      zaloLink = raw
    } else {
      const cleanZaloPhone = raw.replace(/[^0-9]/g, "")
      zaloLink = `https://zalo.me/${cleanZaloPhone || cleanPhone}`
    }
  } else {
    zaloLink = `https://zalo.me/${cleanPhone}`
  }

  const fbLink = facebook && facebook.trim() ? facebook.trim() : "https://www.facebook.com/chanh.chua.330"
  const phoneCall = `tel:${cleanPhone}`

  if (!enableFacebook && !enableZalo && !enablePhone) {
    return null
  }

  return (
    <div
      className={`floating-contact ${position === "left" ? "floating-contact--left" : ""}`}
      aria-label="Liên hệ nhanh"
    >
      {/* Nút Chat ngay trực tiếp trên website */}
      <button
        type="button"
        className="floating-contact__btn floating-contact__btn--chat"
        onClick={onOpenChat}
        aria-label="Chat trực tiếp với Cô Hương và chuyên viên"
        title="Chat trực tiếp với Cô Hương và chuyên viên"
        data-heatmap-id="cta-float-chat"
        style={buttonSize ? { width: buttonSize, height: buttonSize, minWidth: buttonSize, minHeight: buttonSize } : undefined}
      >
        {enablePulse && <span className="floating-contact__pulse" />}
        <span className="floating-contact__icon-chat">💬</span>
        <span className="floating-contact__text-chat">Chat</span>
      </button>

      {enableFacebook && (
        <a
          className="floating-contact__btn floating-contact__btn--facebook"
          href={fbLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Facebook tư vấn"
          title="Nhắn tin Facebook tư vấn"
          data-heatmap-id="cta-float-facebook"
          style={buttonSize ? { width: buttonSize, height: buttonSize, minWidth: buttonSize, minHeight: buttonSize } : undefined}
        >
          {enablePulse && <span className="floating-contact__pulse" />}
          {facebookIcon ? (
            <img src={facebookIcon} alt="Facebook" style={{ width: 24, height: 24, objectFit: "contain" }} />
          ) : (
            <Icon name="facebook" size={20} />
          )}
        </a>
      )}
      {enableZalo && (
        <a
          className="floating-contact__btn floating-contact__btn--zalo"
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Zalo tư vấn"
          title="Nhắn tin Zalo tư vấn"
          data-heatmap-id="cta-float-zalo"
          style={buttonSize ? { width: buttonSize, height: buttonSize, minWidth: buttonSize, minHeight: buttonSize } : undefined}
        >
          {enablePulse && <span className="floating-contact__pulse" />}
          {zaloIcon ? (
            <img src={zaloIcon} alt="Zalo" style={{ width: 24, height: 24, objectFit: "contain" }} />
          ) : (
            <span className="floating-contact__text">Zalo</span>
          )}
        </a>
      )}
      {enablePhone && (
        <a
          className="floating-contact__btn floating-contact__btn--phone"
          href={phoneCall}
          aria-label={`Gọi hotline tư vấn ${phone || "096 290 3942"}`}
          title={`Gọi hotline tư vấn ${phone || "096 290 3942"}`}
          data-heatmap-id="cta-float-phone"
          style={buttonSize ? { width: buttonSize, height: buttonSize, minWidth: buttonSize, minHeight: buttonSize } : undefined}
        >
          {enablePulse && <span className="floating-contact__pulse" />}
          {phoneIcon ? (
            <img src={phoneIcon} alt="Hotline" style={{ width: 24, height: 24, objectFit: "contain" }} />
          ) : (
            <Icon name="phone" size={20} />
          )}
        </a>
      )}
    </div>
  )
}

function useScrollEffects(dep: any, hideTeam = false) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const lenisRef = useRef<Lenis | null>(null)
  const isNavigatingRef = useRef(false)

  const navigateToSection = (sectionId: string) => {
    isNavigatingRef.current = true
    setActiveSection(sectionId)
    setTimeout(() => {
      isNavigatingRef.current = false
    }, 1300)
  }

  useEffect(() => {
    // Khởi tạo Lenis smooth momentum scroll cao cấp (dùng lerp damping siêu mượt)
    const lenis = new Lenis({
      lerp: 0.075, // Trớn quán tính mềm mại, mượt mà chuẩn lụa
      wheelMultiplier: 0.9, // Trọng số cuộn tự nhiên, êm dịu
      touchMultiplier: 1.5,
      smoothWheel: true,
      autoRaf: true,
      anchors: false, // Dùng hệ thống điều hướng custom để kiểm soát cuộn chính xác
    })

    lenisRef.current = lenis
    ;(window as any).__lenis = lenis

    const updateMetrics = (scroll: number, progress: number) => {
      setScrolled(scroll > 20)
      setShowBackToTop(scroll > 350)
      setScrollProgress(progress)

      if (isNavigatingRef.current) return

      // Scrollspy: xác định section đang hiển thị trên màn hình
      const sectionIds = hideTeam
        ? ["about", "areas", "process", "gallery", "resources", "faq", "contact"]
        : ["about", "areas", "process", "team", "gallery", "resources", "faq", "contact"]

      // Ưu tiên Contact khi người dùng cuộn đến gần đáy trang
      const isBottom = window.innerHeight + scroll >= (document.documentElement.scrollHeight - 60)
      if (isBottom) {
        setActiveSection("contact")
        return
      }

      // Khối Hero & Mission ("Giới thiệu"): khi đỉnh #areas vẫn còn ở dưới ngưỡng đọc (> 140px), luôn là "about"
      const areasEl = document.getElementById("areas")
      if (areasEl) {
        const areasTop = areasEl.getBoundingClientRect().top
        if (areasTop > 140) {
          setActiveSection("about")
          return
        }
      } else if (scroll < 250) {
        setActiveSection("about")
        return
      }

      // Duyệt ngược từ cuối về đầu: section nào có đỉnh nằm trên ngưỡng đọc (140px) là section đang xem
      const checkThreshold = 140
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= checkThreshold) {
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
    }

    const handleLenisScroll = (e: any) => {
      const scroll = typeof e?.scroll === "number" ? e.scroll : (window.scrollY || document.documentElement.scrollTop)
      const progress = typeof e?.progress === "number" ? e.progress * 100 : 0
      updateMetrics(scroll, progress)
    }

    const handleNativeScroll = () => {
      const scroll = window.scrollY || document.documentElement.scrollTop
      const totalH = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalH > 0 ? (scroll / totalH) * 100 : 0
      updateMetrics(scroll, progress)
    }

    lenis.on("scroll", handleLenisScroll)
    window.addEventListener("scroll", handleNativeScroll, { passive: true })
    window.addEventListener("resize", handleNativeScroll, { passive: true })

    // Xử lý vị trí ban đầu khi người dùng vào trang / reload:
    // Nếu vào URL có #about hoặc #top (hoặc không có hash), hệ thống phải chuyển đến đầu trang
    const currentHash = window.location.hash.toLowerCase()
    const isAboutOrTop = !currentHash || currentHash === "#about" || currentHash === "#top"

    if (isAboutOrTop) {
      window.scrollTo(0, 0)
      lenis.scrollTo(0, { immediate: true })
      setActiveSection("about")

      // Chống giật & đảm bảo sau khi render / tải font xong vẫn cố định ở đầu trang
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
        lenis.scrollTo(0, { immediate: true })
        setActiveSection("about")
      })
      setTimeout(() => {
        window.scrollTo(0, 0)
        lenis.scrollTo(0, { immediate: true })
        setActiveSection("about")
      }, 100)
    } else {
      // Nếu là các anchor sâu cụ thể khác (#resources, #faq, #contact, #areas, #process, #team, #gallery)
      setTimeout(() => {
        try {
          const targetEl = document.querySelector(window.location.hash)
          if (targetEl) {
            lenis.scrollTo(targetEl, { offset: -74, duration: 1.2 })
            const cleanId = window.location.hash.replace("#", "")
            setActiveSection(cleanId)
          }
        } catch {}
      }, 350)
    }

    return () => {
      lenis.destroy()
      lenisRef.current = null
      delete (window as any).__lenis
      window.removeEventListener("scroll", handleNativeScroll)
      window.removeEventListener("resize", handleNativeScroll)
    }
  }, [hideTeam])

  useEffect(() => {
    // Khi dữ liệu trang cập nhật, cập nhật lại kích thước khung cuộn Lenis
    lenisRef.current?.resize()

    // IntersectionObserver for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    const revealElements = document.querySelectorAll(".reveal")
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [dep])

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return { scrolled, scrollProgress, showBackToTop, scrollToTop, activeSection, navigateToSection }
}

export default function App() {
  const [config, setConfig] = useState<LandingPageConfig>(loadLandingConfig)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hideTeam, setHideTeam] = useState(isZaloCampaignResourcesLanding)

  useEffect(() => {
    const checkUrl = () => setHideTeam(isZaloCampaignResourcesLanding())
    window.addEventListener("popstate", checkUrl)
    window.addEventListener("hashchange", checkUrl)
    return () => {
      window.removeEventListener("popstate", checkUrl)
      window.removeEventListener("hashchange", checkUrl)
    }
  }, [])

  const { scrolled, scrollProgress, showBackToTop, scrollToTop, activeSection, navigateToSection } = useScrollEffects(config, hideTeam)

  useEffect(() => {
    // 1. Fetch latest config from cloud
    const syncFromCloud = async () => {
      const cloudData = await fetchCloudConfig()
      if (cloudData) {
        setConfig(cloudData)
      }
    }
    syncFromCloud()

    // 2. Sync again whenever user refocuses this tab/window
    window.addEventListener("focus", syncFromCloud)

    // 3. Listen for localStorage changes from other tabs on same origin
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setConfig(loadLandingConfig())
        } catch {}
      }
    }
    window.addEventListener("storage", handleStorage)

    // 4. BroadcastChannel for instant real-time sync across open tabs
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel("aurora-cms-sync")
      channel.onmessage = (event) => {
        if (event.data?.type === "config_updated") {
          if (event.data.config) {
            setConfig(event.data.config)
          } else {
            syncFromCloud()
          }
        }
      }
    } catch {}

    // Khởi tạo heatmap tracker cho hành vi chạm / click / cuộn của người dùng
    getHeatmapTracker().init()

    return () => {
      window.removeEventListener("focus", syncFromCloud)
      window.removeEventListener("storage", handleStorage)
      channel?.close()
    }
  }, [])

  return (
    <LandingConfigContext.Provider value={config}>
      <ScrollProgressBar progress={scrollProgress} />
      <Header scrolled={scrolled} activeSection={activeSection} onNavigate={navigateToSection} hideTeam={hideTeam} />
      <Hero />
      <Mission />
      <Areas />
      <DevelopmentalScreener />
      <Process />
      {!hideTeam && <Team hideTeam={hideTeam} />}
      <Space />
      <Resources />
      <Faq />
      <Contact />
      <Footer hideTeam={hideTeam} />
      <FloatingContactBar
        phone={config.phone || "096 290 3942"}
        facebook={config.facebook || "https://www.facebook.com/chanh.chua.330"}
        zalo={config.zalo || config.phone || "096 290 3942"}
        facebookIcon={config.floatingFacebookIcon}
        zaloIcon={config.floatingZaloIcon}
        phoneIcon={config.floatingPhoneIcon}
        buttonSize={config.floatingButtonSize || 52}
        enableFacebook={config.enableFloatingFacebook !== false}
        enableZalo={config.enableFloatingZalo !== false}
        enablePhone={config.enableFloatingPhone !== false}
        enablePulse={config.enableFloatingPulse !== false}
        position={config.floatingPosition || "right"}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <LiveChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        phone={config.phone || "096 290 3942"}
      />
      {config.enableBackToTop !== false && (
        <BackToTop
          visible={showBackToTop}
          onScrollToTop={scrollToTop}
          position={config.floatingPosition || "right"}
        />
      )}
    </LandingConfigContext.Provider>
  )
}
