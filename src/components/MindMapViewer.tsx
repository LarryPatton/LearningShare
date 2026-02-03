'use client';
import { useState } from 'react';

export function MindMapViewer({ src, title }: { src: string; title?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className="my-12">
        {title && (
          <h3 
            className="text-sm font-medium uppercase tracking-wider mb-4"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            ◎ {title}
          </h3>
        )}
        
        {/* 缩略图 */}
        <div 
          className="cursor-pointer group" 
          onClick={() => setIsOpen(true)}
        >
          <div 
            className="border overflow-hidden transition-all group-hover:shadow-lg"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <img 
              src={src} 
              alt="思维导图" 
              className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <p 
            className="text-xs text-center mt-3 transition-opacity group-hover:opacity-70"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            点击查看大图
          </p>
        </div>
      </div>
      
      {/* 全屏弹窗 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl hover:opacity-70 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={src} 
            alt="思维导图" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}