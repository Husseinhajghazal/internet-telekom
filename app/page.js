import Link from "next/link";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-svh gap-6 px-10 bg-linear-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-200 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-3/4 md:w-2/4 lg:w-1/4 animate-fade-in-up">
          <img
            src="/full-logo.png"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-lg md:text-3xl lg:text-5xl font-bold text-gray-800 leading-tight animate-fade-in-up">
          أهلاً وسهلاً بك في شركة إنترنت تيليكوم
        </h1>

        <p className="text-base md:text-xl text-gray-600 leading-relaxed max-w-lg animate-fade-in-up">
          أنت على بعد ضغطة زر واحدة للحصول على أفضل خدمات الإنترنت في تركيا
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md animate-fade-in-up">
          <Button
            variant="primary"
            size="large"
            className="font-semibold lg:font-bold rounded-lg hover:scale-105 w-full sm:w-auto min-w-50"
          >
            <Link
              href="/internet-basvuru-formu"
              className="block w-full h-full py-1"
            >
              تقديم طلب الآن
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="large"
            className="font-semibold lg:font-bold rounded-lg hover:scale-105 w-full sm:w-auto min-w-50"
          >
            <Link href="/inquiry" className="block w-full h-full py-1">
              استعلم عن طلبك
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
