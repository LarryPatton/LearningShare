// 目录项类型定义
export interface TocItem {
  id: string;        // 锚点 ID
  title: string;     // 标题文本
  level: number;     // 层级（2 = H2, 3 = H3）
  children?: TocItem[]; // 子章节（仅 H2 有子章节）
}

/**
 * 从真实 DOM 中提取目录结构
 * @param containerSelector - 容器选择器（默认 '.prose'）
 * @returns 目录数组
 */
export function extractTableOfContents(containerSelector: string = '.prose'): TocItem[] {
  // 只在客户端执行
  if (typeof window === 'undefined') {
    return [];
  }

  // 从真实 DOM 中获取容器
  const container = document.querySelector(containerSelector);
  if (!container) {
    return [];
  }
  
  // 获取所有 H2 和 H3 标题
  const headings = container.querySelectorAll('h2, h3');
  
  const toc: TocItem[] = [];
  let currentH2: TocItem | null = null;

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]); // 'H2' -> 2, 'H3' -> 3
    const title = heading.textContent?.trim() || '';
    
    // 直接读取已经存在的 ID
    const id = heading.id;
    if (!id) {
      console.warn(`Heading without ID: ${title}`);
      return; // 跳过没有ID的标题
    }

    const tocItem: TocItem = {
      id,
      title,
      level,
    };

    if (level === 2) {
      // H2 标题，作为顶级项
      tocItem.children = [];
      toc.push(tocItem);
      currentH2 = tocItem;
    } else if (level === 3 && currentH2) {
      // H3 标题，作为当前 H2 的子项
      currentH2.children!.push(tocItem);
    }
  });

  return toc;
}

/**
 * 为 HTML 内容中的标题添加 ID（如果没有的话）
 * 这个函数在服务端渲染时使用
 * @param htmlContent - HTML 字符串
 * @returns 添加了 ID 的 HTML 字符串
 */
export function addHeadingIds(htmlContent: string): string {
  if (typeof window !== 'undefined') {
    // 客户端不需要这个函数
    return htmlContent;
  }

  // 简单的正则替换（服务端）
  let index = 0;
  return htmlContent.replace(
    /<h([23])>(.*?)<\/h\1>/gi,
    (match, level, title) => {
      const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
      const id = `heading-${index++}-${cleanTitle
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')}`;
      
      return `<h${level} id="${id}">${title}</h${level}>`;
    }
  );
}

/**
 * 将目录树扁平化为一维数组（用于滚动监听）
 * @param toc - 目录树
 * @returns 扁平化的目录数组
 */
export function flattenToc(toc: TocItem[]): TocItem[] {
  const flat: TocItem[] = [];
  
  toc.forEach(item => {
    flat.push(item);
    if (item.children && item.children.length > 0) {
      flat.push(...item.children);
    }
  });
  
  return flat;
}
