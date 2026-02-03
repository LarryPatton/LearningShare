'use client';

export function AudioPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="my-8">
      <h3 
        className="text-sm font-medium uppercase tracking-wider mb-4"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        ♫ {title}
      </h3>
      <div 
        className="border p-4"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-secondary)' 
        }}
      >
        <audio controls className="w-full">
          <source src={src} type="audio/mp4" />
          <source src={src} type="audio/mpeg" />
          <source src={src} type="audio/m4a" />
          您的浏览器不支持音频播放。
        </audio>
      </div>
    </div>
  );
}