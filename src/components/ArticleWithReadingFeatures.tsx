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

  // 在渲染前给 HTML 字符串添加 ID（服务端和客户端都执行）
  const htmlWithIds = useMemo(() => {
    // 在 HTML 字符串中直接添加 ID
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
    
    // 延迟提取，确保 DOM 已更新
    const timer = setTimeout(() => {
      const extracted = extractTableOfContents('.prose');
      console.log('Extracted TOC:', extracted);
      setToc(extracted);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [htmlWithIds]);

  // 扁平化目录（用于滚动监听）
  const flatToc = useMemo(() => flattenToc(toc), [toc]);
  const headingIds = useMemo(() => flatToc.map(item => item.id), [flatToc]);

  // 监听滚动进度
  const progress = useScrollProgress();

  // 监听当前章节
  const activeSection = useActiveSection(headingIds);

  // 当前章节标题（用于显示在浮动导航栏）
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
        <div className="fixed top-0.5 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-40 transition-all duration-300">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* 目录按钮 */}
            <button
              onClick={() => setShowDrawer(true)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">☰</span>
              <span className="hidden sm:inline">目录</span>
            </button>

            {/* 当前章节名称 */}
            <div className="flex-1 mx-4 text-center text-sm text-gray-600 truncate">
              {currentSectionTitle || '文章阅读中'}
            </div>

            {/* 进度和回顶部 */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600 font-medium">
                {Math.round(progress)}%
              </span>
              <button
                onClick={scrollToTop}
                className="text-xl text-gray-700 hover:text-blue-600 transition-colors"
                title="回到顶部"
              >
                ↑
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
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
      />
    </>
  );
}
