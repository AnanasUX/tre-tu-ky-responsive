import { ArticleData } from "./ArticleModal";

export const SAMPLE_ARTICLES: ArticleData[] = [
  {
    id: "speech-vs-autism",
    category: "Âm ngữ trị liệu",
    title: "Phân biệt trẻ chậm nói đơn thuần và trẻ có dấu hiệu tự kỷ",
    summary: "Rất nhiều phụ huynh nhầm lẫn giữa việc trẻ chậm nói đơn thuần và trẻ có nguy cơ tự kỷ. Dưới đây là những dấu hiệu then chốt được các chuyên gia âm ngữ đúc kết.",
    image: "./images/family-1.jpg",
    readTime: "4 phút",
    author: "ThS. Hoàng Thị Hương",
    publishedDate: "20/10/2026",
    content: [
      {
        heading: "1. Sự khác biệt về giao tiếp phi ngôn ngữ",
        paragraphs: [
          "Trẻ chậm nói đơn thuần dù chưa thể nói thành câu nhưng trẻ rất khao khát giao tiếp. Trẻ sẽ kéo tay ba mẹ, chỉ trỏ ngón tay vào món đồ chơi mình thích, gật đầu, lắc đầu hoặc sử dụng các biểu cảm khuôn mặt sống động để diễn đạt mong muốn.",
          "Ngược lại, trẻ có dấu hiệu tự kỷ thường thiếu hụt khả năng giao tiếp phi ngôn ngữ. Trẻ ít hoặc không nhìn vào mắt người đối diện, không dùng ngón trỏ để chỉ chia sẻ sự chú ý, và khi cần thứ gì thường lấy tay người lớn đặt vào đồ vật như một công cụ cơ học mà không nhìn vào mặt người lớn.",
        ],
        tips: [
          "Quan sát xem con có nhìn theo hướng ngón tay ba mẹ chỉ hay không.",
          "Thử gọi tên con khi con đang không tập trung: Trẻ chậm nói sẽ quay lại nhìn ngay, trong khi trẻ tự kỷ thường thờ ơ như không nghe thấy.",
        ],
      },
      {
        heading: "2. Khả năng tương tác xã hội và bắt chước",
        paragraphs: [
          "Trẻ chậm nói thông thường vẫn hào hứng tham gia các trò chơi ú òa, vỗ tay hoan hô, làm mặt xấu cùng người lớn. Trẻ hiểu được ngữ cảnh cảm xúc khi ba mẹ vui hay buồn.",
          "Ở trẻ tự kỷ, khả năng bắt chước hành vi bị suy giảm đáng kể. Trẻ thích chơi một mình một góc, say mê với những chi tiết lặp lại (quay bánh xe ô tô, xếp hàng đồ chơi thẳng tắp, đóng mở nắp hộp liên tục) và thường khó chịu khi ai đó can thiệp vào trật tự của mình.",
        ],
      },
    ],
  },
  {
    id: "aba-principles",
    category: "Hành vi ABA",
    title: "Phương pháp ABA trong can thiệp sớm: Nguyên tắc vàng cho ba mẹ",
    summary: "Phân tích hành vi ứng dụng (ABA) là phương pháp được khoa học quốc tế chứng minh mang lại hiệu quả cao nhất trong việc hình thành hành vi tích cực và giảm thiểu hành vi quấy khóc, bùng nổ.",
    image: "./images/classroom-detail.jpg",
    readTime: "5 phút",
    author: "Ban Chuyên môn HPKid",
    publishedDate: "18/10/2026",
    content: [
      {
        heading: "1. Nguyên lý ABC trong phân tích hành vi",
        paragraphs: [
          "Mọi hành vi của trẻ đều tuân theo mô hình ABC: Antecedent (Tiền đề - điều xảy ra trước hành vi), Behavior (Hành vi của trẻ), và Consequence (Hậu quả - phản ứng của người lớn ngay sau đó).",
          "Ví dụ: Trẻ muốn xem điện thoại (A) -> Lăn ra sàn gào khóc (B) -> Ba mẹ vội vàng đưa điện thoại để dỗ (C). Vô tình, phản ứng của ba mẹ đã củng cố hành vi gào khóc, khiến trẻ hiểu rằng cứ khóc là sẽ có điện thoại.",
        ],
        tips: [
          "Luôn giữ bình tĩnh, không thỏa hiệp trước các hành vi ăn vạ không an toàn.",
          "Khen thưởng tức thì khi con thể hiện hành vi tích cực (chờ đợi, chào hỏi, cất đồ chơi).",
        ],
      },
      {
        heading: "2. Chia nhỏ mục tiêu học tập (Task Analysis)",
        paragraphs: [
          "Trẻ đặc biệt dễ bị quá tải khi tiếp nhận một yêu cầu phức tạp. Phương pháp ABA hướng dẫn ba mẹ bẻ nhỏ một kỹ năng lớn thành 5-7 bước nhỏ để trẻ làm chủ từng bước một cách tự tin.",
        ],
      },
    ],
  },
  {
    id: "sensory-integration",
    category: "Điều hòa giác quan",
    title: "Trò chơi điều hòa cảm giác tại nhà cho trẻ sợ tiếng ồn hoặc thích xoay tròn",
    summary: "Rối loạn xử lý cảm giác (Sensory Processing Disorder) khiến trẻ có những phản ứng quá mức hoặc kém nhạy cảm với âm thanh, ánh sáng, xúc giác và tiền đình thăng bằng.",
    image: "./images/classroom-main.jpg",
    readTime: "4 phút",
    author: "ThS. Hoàng Thị Hương",
    publishedDate: "15/10/2026",
    content: [
      {
        heading: "1. Trẻ tìm kiếm cảm giác tiền đình (Vestibular)",
        paragraphs: [
          "Những trẻ thích xoay tròn liên tục, thích nhảy từ trên cao xuống hoặc đu đưa không biết mệt là những trẻ đang bị đói cảm giác tiền đình. Hệ thần kinh của trẻ cần kích thích mạnh để nhận biết vị trí cơ thể trong không gian.",
        ],
        tips: [
          "Cho trẻ chơi xích đu nhịp nhàng có kiểm soát.",
          "Bài tập nhún nhảy trên đệm êm hoặc bóng tập Gym tròn.",
          "Trò chơi lăn khúc gỗ hoặc cuộn trẻ trong chăn mềm (Hot Dog Roll).",
        ],
      },
      {
        heading: "2. Trẻ quá nhạy cảm với xúc giác và âm thanh",
        paragraphs: [
          "Những trẻ không thích đi chân trần trên cát, sợ cắt móng tay, sợ tiếng máy sấy tóc cần được giải mẫn cảm từ từ bằng các bài tập áp lực sâu (Deep Pressure Therapy).",
        ],
      },
    ],
  },
  {
    id: "iep-roadmap",
    category: "Can thiệp 1:1",
    title: "Giáo án cá nhân hóa IEP là gì? Vì sao mỗi trẻ cần một lộ trình riêng?",
    summary: "Không có hai đứa trẻ tự kỷ nào giống nhau hoàn toàn. IEP (Individualized Education Program) là bản đồ định hướng chính xác từng bước tiến cho con.",
    image: "./images/family-2.jpg",
    readTime: "3 phút",
    author: "Cô Hương HPKid",
    publishedDate: "12/10/2026",
    content: [
      {
        heading: "1. Cấu trúc một bản IEP chuẩn",
        paragraphs: [
          "Một giáo án IEP chuẩn khoa học bao gồm: Đánh giá hiện trạng kỹ năng (Baseline), Xác định mục tiêu ngắn hạn (1 tháng) và dài hạn (3 tháng), Các chiến lược can thiệp cụ thể và Thang đo lượng giá tiến bộ hằng tuần.",
          "Tại Trung tâm Cô Hương, giáo án IEP được xây dựng sau buổi đánh giá chuyên sâu và luôn có sự đồng thuận ký kết giữa Chuyên gia và Phụ huynh.",
        ],
      },
    ],
  },
  {
    id: "school-readiness",
    category: "Tiền tiểu học",
    title: "Chuẩn bị tâm lý và kỹ năng tiền học đường cho trẻ trước khi vào lớp 1",
    summary: "Chuyển tiếp từ mầm non lên lớp 1 là một bước ngoặt lớn, đặc biệt đối với trẻ có nhu cầu đặc biệt. Chuẩn bị từ sớm là chìa khóa để con hòa nhập thành công.",
    image: "./images/family-3.jpg",
    readTime: "4 phút",
    author: "Ban Chuyên môn HPKid",
    publishedDate: "10/10/2026",
    content: [
      {
        heading: "1. Những kỹ năng quan trọng hơn kiến thức sách vở",
        paragraphs: [
          "Nhiều ba mẹ tập trung ép con học chữ, học toán nhưng kỹ năng quan trọng nhất để con hòa nhập lớp 1 là: Kỹ năng ngồi trật tự 20-30 phút, kỹ năng xin phép đi vệ sinh, kỹ năng bảo quản đồ dùng cá nhân và kỹ năng tương tác với bạn bè.",
        ],
      },
    ],
  },
  {
    id: "meltdown-management",
    category: "Kỹ năng gia đình",
    title: "Cách xử lý cơn bùng nổ cảm xúc (Meltdown) của trẻ tại nơi công cộng",
    summary: "Meltdown không phải là ăn vạ hư hỏng mà là trạng thái hệ thần kinh của trẻ bị quá tải cảm giác hoặc cảm xúc. Ba mẹ cần những bước xử lý khoa học và nhân văn.",
    image: "./images/classroom-detail.jpg",
    readTime: "5 phút",
    author: "ThS. Hoàng Thị Hương",
    publishedDate: "05/10/2026",
    content: [
      {
        heading: "1. Nguyên tắc 3 KHÔNG khi trẻ lên cơn bùng nổ",
        paragraphs: [
          "Không lớn tiếng quát mắng hoặc giảng đạo lý lúc này (não trẻ đang ở chế độ phòng vệ sinh tồn, không tiếp nhận ngôn ngữ logic).",
          "Không bỏ mặc trẻ ở nơi nguy hiểm.",
          "Không thỏa hiệp nhượng bộ các yêu cầu vô lý ngay trong lúc trẻ gào khóc.",
        ],
        tips: [
          "Đưa con ra khu vực yên tĩnh, giảm thiểu kích thích âm thanh và ánh sáng.",
          "Áp dụng cái ôm áp lực sâu hoặc nhẹ nhàng nắm tay con nếu con cho phép.",
          "Chờ đợi cơn bão qua đi, khi con bình tĩnh mới nhẹ nhàng trò chuyện và hướng dẫn con cách diễn đạt bằng lời nói hoặc thẻ tranh.",
        ],
      },
    ],
  },
];
