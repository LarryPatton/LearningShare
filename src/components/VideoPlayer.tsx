'use client';

export function VideoPlayer({ src, title }: { src: string; title?: string }) {
  return (
    <div className="my-8">
      {title && (
        <h3 
          className="text-sm font-medium uppercase tracking-wider mb-4"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          ▶ {title}
        </h3>
      )}
      <div 
        className="border overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <video 
          controls 
          className="w-full"
          preload="metadata"
          playsInline
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <source src={src} type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
      </div>
    </div>
  );
}