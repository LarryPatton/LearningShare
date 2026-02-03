'use client';

import { useState, useEffect, useMemo } from 'react';
import { ReadingProgressBar } from './ReadingProgressBar';
import { TableOfContentsDrawer } from './TableOfContentsDrawer';
import { extractTableOfContents, flattenToc } from '@/lib/toc';
import { useScrollProgress, useActiveSection } from '@/hooks/useScrollTracking';

interface Props {
  htmlContent: string;
}

export function ArticleWithReadingFeatures({ htmlContent }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [toc, setToc] = useState<any[]>([]);

  // 在渲染前给 HTML 字符串添加 ID
  const htmlWithIds = useMemo(() => {
    let index = 0;
    return htmlContent.replace(/<(h[23])>(.*?)<\/\1>/gi, (match, tag, content) => {
      const cleanText = content.replace(/<[^>]*>/g, '').trim();
      const id = `heading-${index++}-${cleanText
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')}`;
      
      return `<${tag} id="${id}">${content}</${tag}>`;
    });
  }, [htmlContent]);

  // 在 DOM 渲染后提取目录
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = setTimeout(() => {
      const extracted = extractTableOfContents('.prose-minimal');
      setToc(extracted);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [htmlWithIds]);

  // 扁平化目录
  const flatToc = useMemo(() => flattenToc(toc), [toc]);
  const headingIds = useMemo(() => flatToc.map(item => item.id), [flatToc]);

  // 监听滚动进度
  const progress = useScrollProgress();

  // 监听当前章节
  const activeSection = useActiveSection(headingIds);

  // 当前章节标题
  const currentSectionTitle = useMemo(() => {
    const item = flatToc.find(item => item.id === activeSection);
    return item?.title || '';
  }, [flatToc, activeSection]);

  // 滚动超过一定距离后显示浮动导航栏
  useEffect(() => {
    setShowFloatingNav(progress > 5);
  }, [progress]);

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 顶部进度条 */}
      <ReadingProgressBar />

      {/* 浮动导航栏（滚动后出现） */}
      {showFloatingNav && (
        <div 
          className="fixed top-16 left-0 right-0 z-40 transition-all duration-300 border-b"
          style={{ 
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* 目录按钮 */}
            <button
              onClick={() => setShowDrawer(true)}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">目录</span>
            </button>

            {/* 当前章节名称 */}
            <div 
              className="flex-1 mx-4 text-center text-sm truncate"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {currentSectionTitle || ''}
            </div>

            {/* 进度和回顶部 */}
            <div className="flex items-center gap-4">
              <span 
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {Math.round(progress)}%
              </span>
              <button
                onClick={scrollToTop}
                className="transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)' }}
                title="回到顶部"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 抽屉式目录 */}
      <TableOfContentsDrawer
        open={showDrawer}
        toc={toc}
        activeSection={activeSection}
        progress={progress}
        onClose={() => setShowDrawer(false)}
      />

      {/* 文章内容 */}
      <div
        className="prose-minimal mb-8"
        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
      />
    </>
  );
}