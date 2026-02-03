'use client';

import { useState } from 'react';
import { MobilePDFViewer } from './MobilePDFViewer';

interface Props {
  src: string;
  title?: string;
  slug: string;
}

export function PDFViewerTrigger({ src, title, slug }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 按钮卡片 */}
      <div 
        className="my-8 p-6 border"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-secondary)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 
              className="text-sm font-medium uppercase tracking-wider mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              ◧ PPT 幻灯片
            </h3>
            <p 
              className="text-xs"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              点击查看配套幻灯片
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="btn-primary"
          >
            查看
          </button>
        </div>
      </div>

      {/* PDF 查看器（条件渲染） */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <MobilePDFViewer
            src={src}
            title={title}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}