import Link from "next/link";

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

        <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight animate-fade-in-up">
          أهلاً وسهلاً بك في إنترنت تيليكوم
        </h1>

        <p className="text-base md:text-xl text-gray-600 leading-relaxed max-w-lg animate-fade-in-up">
          أنت على بعد ضغطة زر واحدة للحصول على أفضل خدمات الإنترنت في تركيا
        </p>

        <button className="cursor-pointer bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white text-lg fond-semibold lg:font-bold px-8 lg:px-10 py-2 md:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up">
          <Link href="/apply" className="block w-full h-full">
            ابدأ الآن
          </Link>
        </button>
      </div>
    </div>
  );
}
