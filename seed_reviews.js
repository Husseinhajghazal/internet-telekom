const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviews = [
  {
    name: "أحمد المحمد",
    rating: 5,
    comment:
      "خدمة ممتازة وسريعة! تم تركيب الإنترنت خلال يومين فقط. الدعم الفني بالعربية ساعدني كثيراً في اختيار الباقة المناسبة.",
    service: "تقديم على إنترنت فايبر",
    isApproved: true
  },
  {
    name: "سارة العلي",
    rating: 5,
    comment:
      "أفضل شركة تعاملت معها في تركيا. نقلت خطي لعنوان جديد بكل سلاسة وبدون أي مشاكل. شكراً لفريق الدعم المتميز!",
    service: "نقل خط لعنوان آخر",
    isApproved: true
  },
  {
    name: "محمد الحسن",
    rating: 4,
    comment:
      "سرعة الإنترنت ممتازة والأسعار مناسبة جداً. أنصح الجميع بالتعامل معهم. الباقة بدون عقد أعطتني مرونة كبيرة.",
    service: "اشتراك بدون عقد - Fiber",
    isApproved: true
  },
  {
    name: "فاطمة الزهراء",
    rating: 5,
    comment:
      "استشارة مجانية ساعدتني أختار الباقة الصح. الفريق متعاون جداً وصبور في الشرح. تجربة رائعة من البداية للنهاية.",
    service: "استشارة مجانية",
    isApproved: true
  },
  {
    name: "عبدالله كريم",
    rating: 5,
    comment:
      "جمّدت اشتراكي لمدة شهرين بسبب السفر وتم إعادة التفعيل فوراً عند عودتي. خدمة محترمة وتواصل سهل بالعربية.",
    service: "تجميد خط الإنترنت",
    isApproved: true
  },
  {
    name: "نور الهدى",
    rating: 4,
    comment:
      "GigaFiber سرعة خيالية! ألعاب أونلاين وبث مباشر بدون أي تقطيع. سعيدة جداً بالخدمة والسعر مقارنة بالشركات الأخرى.",
    service: "اشتراك بدون عقد - GigaFiber",
    isApproved: true
  },
  {
    name: "خالد الراشد",
    rating: 5,
    comment:
      "نقلت ملكية الخط من صديقي لاسمي بكل سهولة. الإجراءات كانت بسيطة والفريق تابع معي خطوة بخطوة حتى اكتمل كل شيء.",
    service: "نقل ملكية خط الإنترنت",
  },
  {
    name: "ريم الأحمد",
    rating: 5,
    comment:
      "أكثر شيء أعجبني هو الشفافية في الأسعار. لا رسوم مخفية ولا مفاجآت بالفاتورة. تجربة ممتازة وأنصح فيها الجميع.",
    service: "اشتراك بدون عقد - VDSL",
    isApproved: true
  },
];

async function main() {
  const existing = await prisma.review.count();
  if (existing === 0) {
    await prisma.review.createMany({
      data: reviews,
    });
    console.log("Seeded default reviews.");
  } else {
    console.log("Reviews already seeded.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
