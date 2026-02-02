'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * 自定义 Hook：监听滚动进度
 * @returns 滚动进度百分比 (0-100)
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    handleScroll();

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return progress;
}

/**
 * 自定义 Hook：监听当前可见的章节（Intersection Observer）
 * @param headingIds - 所有章节的 ID 数组
 * @returns 当前可见的章节 ID
 */
export function useActiveSection(headingIds: string[]): string {
  const [activeSection, setActiveSection] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headingIds.length === 0) return;

    // 清理旧的 observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // 创建新的 Intersection Observer
    observer.current = new IntersectionObserver(
      (entries) => {
        // 找到第一个进入视口的标题
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // 按照在页面中的位置排序，取最上面的一个
          const topEntry = visibleEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          })[0];
          
          setActiveSection(topEntry.target.id);
        }
      },
      {
        // 配置选项
        rootMargin: '-20% 0px -70% 0px', // 顶部 20%，底部 70%
        threshold: [0, 0.25, 0.5, 0.75, 1], // 多个阈值，更精确
      }
    );

    // 观察所有标题元素
    headingIds.forEach(id => {
      const element = document.getElementById(id);
      if (element && observer.current) {
        observer.current.observe(element);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [headingIds]);

  return activeSection;
}
