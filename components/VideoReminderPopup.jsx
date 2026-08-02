import React from "react";
import { FaYoutube } from "react-icons/fa";
import Button from "./Button";
import YouTubeEmbed from "./YouTubeEmbed";

const VideoReminderPopup = ({
  videoId = "xJzsYrgtIYc",
  onWatch,
  onContinue,
  onVideoPlay,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onWatch} />
    <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-gray-200 p-6 md:p-8 text-center space-y-5 max-h-[90vh] overflow-y-auto">
      <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <FaYoutube className="text-red-500" size={34} />
      </div>
      <h3 className="text-lg md:text-xl font-extrabold text-gray-800 leading-relaxed">
        من فضلك شاهد الفيديو قبل الإنتقال للخطوة القادمة
      </h3>
      <YouTubeEmbed
        videoId={videoId}
        title="YouTube video player"
        className="w-full aspect-video rounded-xl shadow-md overflow-hidden"
        onPlay={onVideoPlay}
      />
      <div className="flex flex-col md:flex-row gap-3">
        <Button variant="secondary" className="flex-1" onClick={onWatch}>
          إغلاق
        </Button>
        <Button variant="primary" className="flex-1" onClick={onContinue}>
          المتابعة للخطوة القادمة
        </Button>
      </div>
    </div>
  </div>
);

export default VideoReminderPopup;
