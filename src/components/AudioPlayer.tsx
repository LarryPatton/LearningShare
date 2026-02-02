'use client';

export function AudioPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow">
      <p className="text-sm font-medium mb-3 flex items-center gap-2">
        <span className="text-2xl">🎧</span>
        <span>{title}</span>
      </p>
      <audio controls className="w-full">
        <source src={src} type="audio/mp4" />
        <source src={src} type="audio/mpeg" />
        您的浏览器不支持音频播放。
      </audio>
    </div>
  );
}
