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
      // 计算元素距离顶部的距离（考虑浮动导航栏）
      const yOffset = -100; // 留出更多顶部空间（进度条 + 导航栏）
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      onClose();
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 抽屉内容 */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[70%] max-w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b px-4 py-4 z-10">
          <h3 className="text-lg font-bold text-gray-900 mb-2">📑 文章目录</h3>
          
          {/* 阅读进度 */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">阅读进度</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-blue-600 font-medium w-10 text-right">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* 目录列表 */}
        <nav className="p-4">
          {toc.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              暂无目录
            </p>
          ) : (
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.id}>
                  {/* H2 标题 */}
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {activeSection === item.id ? '📍' : '○'}
                      <span className="line-clamp-2">{item.title}</span>
                    </span>
                  </button>

                  {/* H3 子标题 */}
                  {item.children && item.children.length > 0 && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => handleClick(child.id)}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                              activeSection === child.id
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {activeSection === child.id ? '•' : '◦'}
                              <span className="line-clamp-2">{child.title}</span>
                            </span>
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
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            ✕ 关闭目录
          </button>
        </div>
      </div>
    </>
  );
}
