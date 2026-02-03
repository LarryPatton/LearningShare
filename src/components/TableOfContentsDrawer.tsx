'use client';

import { useEffect } from 'react';
import { TocItem } from '@/lib/toc';

interface Props {
  open: boolean;
  toc: TocItem[];
  activeSection: string;
  progress: number;
  onClose: () => void;
}

export function TableOfContentsDrawer({
  open,
  toc,
  activeSection,
  progress,
  onClose,
}: Props) {
  // 防止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  // 点击章节跳转
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />

      {/* 抽屉内容 */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[70%] max-w-[320px] z-50 transform transition-transform duration-300 overflow-y-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        {/* 头部 */}
        <div 
          className="sticky top-0 border-b px-6 py-6 z-10"
          style={{ 
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)'
          }}
        >
          <h3 
            className="text-sm font-medium uppercase tracking-wider mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            目录
          </h3>
          
          {/* 阅读进度 */}
          <div className="flex items-center gap-3 text-xs">
            <span style={{ color: 'var(--color-text-tertiary)' }}>进度</span>
            <div 
              className="flex-1 h-1 overflow-hidden"
              style={{ backgroundColor: 'var(--color-border)' }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: 'var(--color-text-primary)'
                }}
              />
            </div>
            <span 
              className="font-medium w-10 text-right"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* 目录列表 */}
        <nav className="p-6">
          {toc.length === 0 ? (
            <p 
              className="text-sm text-center py-8"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              暂无目录
            </p>
          ) : (
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.id}>
                  {/* H2 标题 */}
                  <button
                    onClick={() => handleClick(item.id)}
                    className="w-full text-left px-3 py-2 text-sm transition-opacity hover:opacity-70"
                    style={{ 
                      color: activeSection === item.id 
                        ? 'var(--color-text-primary)' 
                        : 'var(--color-text-secondary)',
                      fontWeight: activeSection === item.id ? 600 : 400
                    }}
                  >
                    <span className="line-clamp-2">{item.title}</span>
                  </button>

                  {/* H3 子标题 */}
                  {item.children && item.children.length > 0 && (
                    <ul className="ml-4 border-l" style={{ borderColor: 'var(--color-border)' }}>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => handleClick(child.id)}
                            className="w-full text-left px-3 py-1.5 text-xs transition-opacity hover:opacity-70"
                            style={{ 
                              color: activeSection === child.id 
                                ? 'var(--color-text-primary)' 
                                : 'var(--color-text-tertiary)'
                            }}
                          >
                            <span className="line-clamp-2">{child.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* 底部关闭按钮 */}
        <div 
          className="sticky bottom-0 border-t p-6"
          style={{ 
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)'
          }}
        >
          <button
            onClick={onClose}
            className="btn-primary w-full text-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </>
  );
}