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
  tags: string[];
  excerpt: string;
  author: string;
  cover?: string;
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

// 获取所有文章的 slug
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    return fs.statSync(fullPath).isDirectory();
  });
}

// 根据 slug 获取文章完整数据
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 解析 Front Matter
  const { data, content } = matter(fileContents);

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
