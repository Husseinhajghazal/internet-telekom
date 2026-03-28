import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata = {
  metadataBase: new URL(process.env.website_url),
  title: "إنترنت تيليكوم | طلب خط إنترنت جديد وخدمات الإنترنت في تركيا",
  description:
    "قدّم الآن على خط إنترنت جديد في تركيا بسهولة مع إنترنت تيليكوم. نوفر أفضل خدمات الإنترنت المنزلي، الاستعلام عن الاشتراك، وباقات تناسب جميع الاحتياجات في جميع المدن التركية.",
  keywords: [
    "إنترنت تركيا",
    "خط إنترنت جديد",
    "مزود إنترنت تركيا",
    "باقات إنترنت منزلي",
    "التقديم على الإنترنت في تركيا",
  ],
  openGraph: {
    title: "إنترنت تيليكوم | خدمات الإنترنت في تركيا",
    description:
      "احصل على أفضل عروض الإنترنت في تركيا. قدّم الآن على خط جديد بسهولة واستعلم عن خدماتك.",
    url: process.env.website_url,
    siteName: "إنترنت تيليكوم",
    locale: "ar_TR",
    type: "website",
    images: [
      {
        url: `${process.env.website_url}/logo.png`,
        width: 1200,
        height: 630,
        alt: "إنترنت تيليكوم | خدمات الإنترنت في تركيا",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased`}>{children}</body>
    </html>
  );
}
