'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 配置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  src: string;
  title?: string;
  onClose?: () => void;
}

export function MobilePDFViewer({ src, title, onClose }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [isPortrait, setIsPortrait] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const hideTimer = useRef<NodeJS.Timeout>();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // 检测屏幕方向和窗口宽度
  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        setIsPortrait(window.innerHeight > window.innerWidth);
        setWindowWidth(window.innerWidth);
      }
    };
    
    checkOrientation();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkOrientation);
      return () => window.removeEventListener('resize', checkOrientation);
    }
  }, []);

  // 自动隐藏控制栏（3秒）
  useEffect(() => {
    if (showControls) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  // 文档加载完成
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // 上一页（竖屏时翻2页）
  const prevPage = useCallback(() => {
    const step = isPortrait ? 2 : 1;
    setCurrentPage((prev) => Math.max(1, prev - step));
    setShowControls(true);
  }, [isPortrait]);

  // 下一页（竖屏时翻2页）
  const nextPage = useCallback(() => {
    const step = isPortrait ? 2 : 1;
    setCurrentPage((prev) => Math.min(numPages, prev + step));
    setShowControls(true);
  }, [isPortrait, numPages]);

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  // 触摸结束（检测滑动）
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    
    // 水平滑动距离大于垂直滑动，且超过50px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevPage(); // 右滑 - 上一页
      } else {
        nextPage(); // 左滑 - 下一页
      }
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // 点击（非滑动）- 切换控制栏显示
      setShowControls((prev) => !prev);
    }
    
    touchStart.current = null;
  };

  // 缩放选项
  const scaleOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  // 当前显示的页码范围（竖屏显示2页）
  const displayPages = isPortrait
    ? [currentPage, Math.min(currentPage + 1, numPages)]
    : [currentPage];

  // 计算页面宽度（竖屏时全宽，横屏时全宽）
  const pageWidth = windowWidth > 0 ? windowWidth * scale : 400;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部控制栏 */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 transition-opacity duration-300">
          <div className="flex justify-between items-center text-white">
            <button
              onClick={onClose || (() => {
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              })}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-xl">←</span>
              <span>返回</span>
            </button>
            <div className="text-sm font-medium">
              {isPortrait && currentPage + 1 <= numPages
                ? `${currentPage}-${currentPage + 1} / ${numPages}`
                : `${currentPage} / ${numPages}`}
            </div>
            <button
              onClick={onClose || (() => {
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              })}
              className="text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* PDF 内容区 */}
      <div className="w-full h-full overflow-auto flex items-center justify-center">
        <Document
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-white text-center">
              <div className="text-2xl mb-2">⏳</div>
              <div>加载中...</div>
            </div>
          }
          error={
            <div className="text-white text-center p-4">
              <div className="text-2xl mb-2">⚠️</div>
              <div>PDF 加载失败</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white/20 rounded"
              >
                重新加载
              </button>
            </div>
          }
        >
          <div className={`flex ${isPortrait ? 'flex-col' : 'flex-row'} gap-1`}>
            {displayPages.map((pageNum) => (
              <Page
                key={pageNum}
                pageNumber={pageNum}
                width={pageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                loading=""
              />
            ))}
          </div>
        </Document>
      </div>

      {/* 底部控制栏 */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10 transition-opacity duration-300">
          {/* 翻页按钮 */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              ← 上一页
            </button>
            <span className="text-white text-sm">
              {Math.round(((isPortrait ? currentPage / 2 : currentPage) / (isPortrait ? numPages / 2 : numPages)) * 100)}%
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= numPages}
              className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              下一页 →
            </button>
          </div>

          {/* 进度滑块 */}
          <input
            type="range"
            min="1"
            max={isPortrait ? Math.ceil(numPages / 2) : numPages}
            value={isPortrait ? Math.ceil(currentPage / 2) : currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentPage(isPortrait ? (val - 1) * 2 + 1 : val);
            }}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer mb-4"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((isPortrait ? currentPage / 2 : currentPage) / (isPortrait ? numPages / 2 : numPages)) * 100}%, rgba(255,255,255,0.3) ${((isPortrait ? currentPage / 2 : currentPage) / (isPortrait ? numPages / 2 : numPages)) * 100}%, rgba(255,255,255,0.3) 100%)`
            }}
          />

          {/* 工具栏 */}
          <div className="grid grid-cols-3 gap-2 text-white text-xs">
            {/* 缩放选择器 */}
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="px-3 py-2 bg-white/20 rounded-lg text-center"
            >
              {scaleOptions.map((s) => (
                <option key={s} value={s} className="text-black">
                  {Math.round(s * 100)}%
                </option>
              ))}
            </select>

            {/* 全屏 */}
            <button
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
                }
              }}
              className="px-3 py-2 bg-white/20 rounded-lg"
            >
              ⛶ 全屏
            </button>

            {/* 下载 */}
            <button
              onClick={() => window.open(src, '_blank')}
              className="px-3 py-2 bg-white/20 rounded-lg"
            >
              ⬇️ 下载
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
