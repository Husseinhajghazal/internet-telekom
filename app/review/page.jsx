import prisma from "../../lib/prisma";
import ReviewFormClient from "../../components/form/ReviewFormClient";

export const metadata = {
  title: "تقييم الخدمة",
};

export default async function ReviewPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const appId = resolvedSearchParams.appId;

  if (!appId) {
    return (
      <div className="min-h-svh flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <p className="text-red-500 font-bold text-xl">رابط التقييم غير صالح.</p>
        </div>
      </div>
    );
  }

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: { Review: true }
  });

  if (!app) {
    return (
       <div className="min-h-svh flex items-center justify-center p-6 bg-slate-50">
          <p className="text-red-500 font-bold text-xl">لا يمكن العثور على هذا الطلب. الرابط قد يكون خاطئاً.</p>
      </div>
    );
  }

  if (app.Review) {
    return (
       <div className="min-h-svh flex flex-col items-center justify-center p-6 bg-slate-50">
          <div className="flex items-center justify-center bg-green-100 p-5 rounded-full mb-4">
            <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-800 font-bold text-xl">لقد قمت بإرسال التقييم لهذه الخدمة مسبقاً. شكراً لك!</p>
      </div>
    );
  }

  return <ReviewFormClient appId={appId} service={app.service} name={app.newName || app.name} />;
}
