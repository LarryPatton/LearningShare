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
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">PPT 幻灯片</h3>
            <p className="text-sm text-gray-600">点击按钮查看配套幻灯片</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          📄 查看 PPT 幻灯片
        </button>
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
