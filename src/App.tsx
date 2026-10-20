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
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "profile"

const iconPaths: Record<IconName, ReactNode> = {
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
}: {
  children: ReactNode
  variant?: "primary" | "secondary"
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
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
    <div className="section-title">
      <h2>{title}</h2>
      <p>{description}</p>
      {eyebrow && <span className="section-title__note">{eyebrow}</span>}
    </div>
  )
}

function getSection(config: LandingPageConfig, id: string): LandingSection | undefined {
  return config.sections.find((s) => s.id === id)
}

function Header() {
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

  return (
    <header className="header">
      <div className="container header__top">
        <a className="brand-link" href="#top" aria-label="Về trang chủ">
          <Logo />
        </a>
        <a className="button button--primary header__cta" href="#contact">
          {config.consultationLabel || "Đăng ký tư vấn"}
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
      <div className="header__nav-row">
        <nav
          className={`container nav ${open ? "nav--open" : ""}`}
          aria-label="Điều hướng chính"
        >
          {config.navigation.map((item, index) => (
            <a
              key={`${item.path}-${index}`}
              className={index === 0 ? "nav__active" : ""}
              href={item.path}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="button button--primary nav__cta"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            {config.consultationLabel || "Đăng ký tư vấn"}
          </a>
        </nav>
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
        <div className="hero__content">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#contact">
              {primaryAction}
            </a>
            <a className="button button--secondary" href="#process">
              {secondaryAction}
            </a>
          </div>
          <div className="hero__notes">
            <span>Tôn trọng khác biệt</span>
            <span>Minh bạch mục tiêu</span>
            <span>Đồng hành cùng gia đình</span>
          </div>
        </div>
        <figure className="hero__visual">
          <img
            src={image}
            alt="Không gian học tập ấm áp với vật liệu gỗ tự nhiên"
          />
          <figcaption>
            Minh hoạ · không phải hình ảnh thực tế của trung tâm
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
            <article className="mission-card" key={`${card.title}-${idx}`}>
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
            <article className="area-card" key={`${area.title}-${index}`}>
              <span className={`icon-box icon-box--c${(index % 6) + 1}`}>
                <Icon name={area.icon} />
              </span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
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
            <article className="process-card" key={`${step.number}-${index}`}>
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

function Team() {
  const config = useConfig()
  const section = getSection(config, "team")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Cần trung tâm xác minh hồ sơ"
  const title = section?.title ?? "Đội ngũ giáo viên"
  const description =
    section?.description ??
    "Mỗi hồ sơ có sẵn vị trí cho ảnh, tên, chuyên môn và phần giới thiệu. Thông tin chính thức sẽ được cập nhật sau khi trung tâm xác minh."

  const defaultTeam = [
    { name: "Tên giáo viên", role: "Chuyên môn / vai trò", bio: "Thêm phần giới thiệu ngắn về kinh nghiệm, chuyên môn và phương pháp đồng hành cùng trẻ.", image: "" },
    { name: "Tên giáo viên", role: "Chuyên môn / vai trò", bio: "Thêm phần giới thiệu ngắn về kinh nghiệm, chuyên môn và phương pháp đồng hành cùng trẻ.", image: "" },
    { name: "Tên giáo viên", role: "Chuyên môn / vai trò", bio: "Thêm phần giới thiệu ngắn về kinh nghiệm, chuyên môn và phương pháp đồng hành cùng trẻ.", image: "" },
    { name: "Tên giáo viên", role: "Chuyên môn / vai trò", bio: "Thêm phần giới thiệu ngắn về kinh nghiệm, chuyên môn và phương pháp đồng hành cùng trẻ.", image: "" },
  ]

  const members = section?.items && section.items.length > 0
    ? section.items.map((item) => ({
        name: item.title,
        role: item.meta || "Chuyên môn / vai trò",
        bio: item.description ?? "",
        image: item.image,
      }))
    : defaultTeam

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
            <article className="profile-card" key={`${item.name}-${index}`}>
              <div className="profile-card__portrait">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="profile-card__placeholder" aria-hidden="true">
                    <Icon name="profile" size={52} />
                    <span>Thêm ảnh chân dung</span>
                  </div>
                )}
              </div>
              <div className="profile-card__content">
                <h3>{item.name}</h3>
                <span className="profile-card__role">{item.role}</span>
                <p>{item.bio}</p>
                <span className="status-label">{item.image ? "Đã xác minh" : "Chờ cập nhật"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Space() {
  const config = useConfig()
  const section = getSection(config, "gallery")
  if (section && !section.enabled) return null

  const title = section?.title ?? "Không gian học tập"
  const description =
    section?.description ??
    "Các hình ảnh dưới đây chỉ minh hoạ định hướng không gian. Cần bổ sung ảnh thực tế được phép sử dụng trước khi triển khai."

  return (
    <section className="section section--tint" id="gallery">
      <div className="container">
        <SectionTitle title={title} description={description} />
        <div className="gallery">
          <figure className="gallery__main">
            <img
              src="./images/classroom-main.jpg"
              alt="Toàn cảnh phòng học sáng, thoáng với nội thất gỗ"
            />
            <figcaption>Minh hoạ · không phải ảnh trung tâm</figcaption>
          </figure>
          <figure>
            <img
              src="./images/classroom-detail.jpg"
              alt="Chi tiết góc học tập với vật liệu tự nhiên"
            />
            <figcaption>Minh hoạ · không phải ảnh trung tâm</figcaption>
          </figure>
          <figure>
            <img
              src="./images/classroom-main.jpg"
              alt="Góc hoạt động trong phòng học"
            />
            <figcaption>Minh hoạ · không phải ảnh trung tâm</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Resources() {
  const config = useConfig()
  const section = getSection(config, "resources")
  if (section && !section.enabled) return null

  const eyebrow = section?.eyebrow ?? "Chủ đề gợi ý · chưa xuất bản"
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
            <article className="resource-card" key={`${item.title}-${idx}`}>
              <div className="card-media">
                <img src={item.image} alt="Hình minh hoạ cho chủ đề bài viết" />
                <span className="media-note">Minh hoạ · không phải ảnh thật</span>
              </div>
              <div>
                <span className="resource-card__tag">{item.tag} · chưa xuất bản</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="text-link text-link--disabled">Chưa có đường dẫn</span>
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
    ["Tôi có thể trao đổi với chuyên viên như thế nào?", "Trung tâm cần xác minh phương thức trao đổi, tần suất cập nhật và cách thức phối hợp với gia đình."],
    ["Phụ huynh có thể tham gia trong quá trình hỗ trợ không?", "Hình thức tham gia của phụ huynh cần được thống nhất theo từng mục tiêu và xác nhận bởi trung tâm."],
    ["Thời lượng và lịch hỗ trợ được sắp xếp như thế nào?", "Thời lượng, lịch và hình thức hỗ trợ chưa được công bố trong bản thiết kế này. Vui lòng chờ thông tin chính thức."],
    ["Thông tin gia đình được sử dụng ra sao?", "Chính sách quyền riêng tư và quy trình lưu trữ dữ liệu cần được duyệt trước khi biểu mẫu được kết nối vận hành."],
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

  const eyebrow = section?.eyebrow ?? "Bắt đầu bằng một cuộc trò chuyện"
  const title = section?.title ?? "Trao đổi cùng trung tâm"
  const description =
    section?.description ??
    "Đây là biểu mẫu giao diện tham khảo. Thông tin chỉ nên được gửi khi trung tâm xác nhận kênh tiếp nhận và chính sách quyền riêng tư."
  const primaryAction = section?.primaryAction ?? "Gửi yêu cầu tư vấn"

  const [sent, setSent] = useState(false)
  const [consent, setConsent] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="notice notice--info">
            <Icon name="chat" size={20} />
            <span>
              <strong>Chưa kết nối gửi</strong>
              Cần xác nhận thông tin liên hệ và nơi lưu trữ dữ liệu.
            </span>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          {sent ? (
            <div className="form-success">
              <span className="icon-box">
                <Icon name="chat" />
              </span>
              <h3>Mẫu đang ở chế độ minh hoạ</h3>
              <p>
                Thông tin chưa được gửi hoặc lưu. Trạng thái này chỉ xác nhận
                định dạng biểu mẫu hợp lệ.
              </p>
              <Button onClick={() => setSent(false)} variant="secondary">
                Quay lại biểu mẫu
              </Button>
            </div>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="name">Họ tên phụ huynh</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  name="phone"
                  placeholder={config.phone ? `Ví dụ: ${config.phone}` : "Ví dụ: 090 123 4567"}
                  required
                  type="tel"
                />
              </div>
              <div className="form-field">
                <label htmlFor="need">Nhu cầu gia đình quan tâm</label>
                <select id="need" name="need">
                  <option value="">Chọn nhu cầu</option>
                  <option>Giao tiếp / Ngôn ngữ</option>
                  <option>Kỹ năng xã hội</option>
                  <option>Cảm xúc</option>
                  <option>Học tập</option>
                  <option>Nội dung khác</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="message">Điều bạn muốn chia sẻ thêm</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Không nhập dữ liệu nhạy cảm của trẻ"
                  rows={4}
                />
              </div>
              <label className="checkbox">
                <input
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  Tôi đồng ý để trung tâm liên hệ về nhu cầu tư vấn. Nội dung
                  consent và chính sách quyền riêng tư cần được duyệt trước khi
                  triển khai.
                </span>
              </label>
              <Button disabled={!consent} type="submit">
                {primaryAction}
              </Button>
              <small>
                Bản mẫu chưa kết nối hệ thống gửi hoặc lưu dữ liệu.
              </small>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  const config = useConfig()
  const section = getSection(config, "footer")
  if (section && !section.enabled) return null

  const description =
    section?.description ??
    "Trang này chỉ là bản thiết kế tham khảo. Nội dung, hình ảnh, đội ngũ, bài viết và thông tin liên hệ cần được trung tâm xác minh trước khi triển khai."

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
          <a href="#team">Đội ngũ</a>
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
        <span>Bản thiết kế tham khảo · không phải website vận hành</span>
        <span>{config.address || "Hà Nội, Việt Nam"} · {config.phone || "090 123 4567"}</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [config, setConfig] = useState<LandingPageConfig>(loadLandingConfig)

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

    return () => {
      window.removeEventListener("focus", syncFromCloud)
      window.removeEventListener("storage", handleStorage)
      channel?.close()
    }
  }, [])

  return (
    <LandingConfigContext.Provider value={config}>
      <Header />
      <Hero />
      <Mission />
      <Areas />
      <Process />
      <Team />
      <Space />
      <Resources />
      <Faq />
      <Contact />
      <Footer />
    </LandingConfigContext.Provider>
  )
}
