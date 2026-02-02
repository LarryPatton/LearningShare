'use client';
import Image from 'next/image';
import { useState } from 'react';

export function MindMapViewer({ src, title }: { src: string; title?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className="my-8">
        {title && <h3 className="text-lg font-semibold mb-3">🗺️ {title}</h3>}
        
        {/* 缩略图 */}
        <div 
          className="cursor-pointer hover:opacity-90 transition" 
          onClick={() => setIsOpen(true)}
        >
          <img 
            src={src} 
            alt="思维导图" 
            className="w-full rounded-lg border shadow hover:shadow-lg transition"
          />
          <p className="text-sm text-center mt-2 text-gray-600">
            点击查看大图 🔍
          </p>
        </div>
      </div>
      
      {/* 全屏弹窗 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            ✕
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
