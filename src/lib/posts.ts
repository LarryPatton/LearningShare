import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  category: string;
  subcategory?: string;  // 新增：子分类
  tags: string[];
  excerpt: string;
  author: string;
  cover?: string;
  readingTime?: number;  // 阅读时间（分钟）
  difficulty?: string;   // 难度级别
  resources?: {
    mindmap?: string;
    slides?: string;
    flashcards?: string;
    video?: string;
    audio?: string;
  };
  keywords?: string;
}

export interface Post extends PostMetadata {
  content: string;
  htmlContent: string;
}

/**
 * 递归扫描目录，找到所有包含 index.md 的文章目录
 * 支持多级分类结构：posts/category/subcategory/article/
 */
function findAllArticles(dir: string, basePath: string = ''): string[] {
  const articles: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return articles;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 检查是否是文章目录（包含 index.md）
      const indexPath = path.join(fullPath, 'index.md');
      if (fs.existsSync(indexPath)) {
        // 这是一个文章目录，记录其相对路径
        const relativePath = basePath ? `${basePath}/${item}` : item;
        articles.push(relativePath);
      } else {
        // 这是一个分类目录，继续递归
        const relativePath = basePath ? `${basePath}/${item}` : item;
        articles.push(...findAllArticles(fullPath, relativePath));
      }
    }
  }
  
  return articles;
}

// 获取所有文章的路径（相对于 posts 目录）
export function getAllPostSlugs() {
  return findAllArticles(postsDirectory);
}

/**
 * 从文章路径中提取分类信息
 * 例如：coding/design-patterns/lsp-liskov -> { category: 'coding', subcategory: 'design-patterns' }
 */
function extractCategoryFromPath(articlePath: string): { category?: string; subcategory?: string } {
  const parts = articlePath.split('/');
  
  if (parts.length === 1) {
    // 旧结构：直接在 posts 下，没有分类
    return {};
  } else if (parts.length === 2) {
    // 一级分类：posts/coding/article
    return { category: parts[0] };
  } else if (parts.length >= 3) {
    // 二级分类：posts/coding/design-patterns/article
    return { category: parts[0], subcategory: parts[1] };
  }
  
  return {};
}

// 根据 slug 获取文章完整数据
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 解析 Front Matter
  const { data, content } = matter(fileContents);

  // 从路径中提取分类信息（如果 frontmatter 中没有）
  const pathCategory = extractCategoryFromPath(slug);
  if (!data.category && pathCategory.category) {
    data.category = pathCategory.category;
  }
  if (!data.subcategory && pathCategory.subcategory) {
    data.subcategory = pathCategory.subcategory;
  }

  // 确保 date 是字符串格式
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().split('T')[0];
  }

  // 将 Markdown 转换为 HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(content);
  const htmlContent = processedContent.toString();

  return {
    ...(data as PostMetadata),
    slug,  // 确保 slug 被设置
    content,
    htmlContent,
  };
}

// 获取所有文章数据
export async function getAllPosts(): Promise<Post[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  );
  
  // 按日期排序（最新的在前）
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// 检查资源文件是否存在
export function getResourcePath(slug: string, resource: string): string | null {
  const resourcePath = path.join(postsDirectory, slug, resource);
  if (fs.existsSync(resourcePath)) {
    return `/content/posts/${slug}/${resource}`;
  }
  return null;
}

/**
 * 根据分类获取文章列表
 */
export async function getPostsByCategory(category: string, subcategory?: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  
  return allPosts.filter(post => {
    if (subcategory) {
      return post.category === category && post.subcategory === subcategory;
    }
    return post.category === category;
  });
}

/**
 * 获取所有分类
 */
export function getAllCategories(): { category: string; subcategories: string[] }[] {
  const slugs = getAllPostSlugs();
  const categoryMap = new Map<string, Set<string>>();
  
  slugs.forEach(slug => {
    const { category, subcategory } = extractCategoryFromPath(slug);
    if (category) {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Set());
      }
      if (subcategory) {
        categoryMap.get(category)!.add(subcategory);
      }
    }
  });
  
  return Array.from(categoryMap.entries()).map(([category, subcategories]) => ({
    category,
    subcategories: Array.from(subcategories),
  }));
}
