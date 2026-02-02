'use client';

export function VideoPlayer({ src, title }: { src: string; title?: string }) {
  return (
    <div className="my-8">
      {title && <h3 className="text-lg font-semibold mb-3">🎥 {title}</h3>}
      <video 
        controls 
        className="w-full rounded-lg shadow-lg"
        preload="metadata"
        playsInline
      >
        <source src={src} type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
    </div>
  );
}
