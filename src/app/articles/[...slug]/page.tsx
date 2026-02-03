import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { VideoPlayer } from '@/components/VideoPlayer';
import { AudioPlayer } from '@/components/AudioPlayer';
import { PDFViewerTrigger } from '@/components/PDFViewerTrigger';
import { MindMapViewer } from '@/components/MindMapViewer';
import { FlashcardsViewer } from '@/components/FlashcardsViewer';
import { ArticleWithReadingFeatures } from '@/components/ArticleWithReadingFeatures';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.split('/'),
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slugPath = params.slug.join('/');
  const post = await getPostBySlug(slugPath);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 文章头部 */}
      <header className="py-16 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container-article">
          {/* 返回链接 */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          {/* 分类和日期 */}
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {post.category}
            </span>
            {post.subcategory && (
              <>
                <span style={{ color: 'var(--color-border)' }}>/</span>
                <span 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {post.subcategory}
                </span>
              </>
            )}
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <span 
              className="text-xs"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {post.date}
            </span>
          </div>

          {/* 标题 */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {post.title}
          </h1>

          {/* 摘要 */}
          {post.excerpt && (
            <p 
              className="text-lg md:text-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {post.excerpt}
            </p>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          {/* 作者和阅读时间 */}
          <div 
            className="flex items-center gap-4 mt-8 pt-6 border-t text-sm"
            style={{ 
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-tertiary)' 
            }}
          >
            <span>作者: {post.author}</span>
            {post.readingTime && <span>阅读时间: {post.readingTime} 分钟</span>}
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 py-12">
        <div className="container-article">
          {/* 封面图 */}
          {post.cover && (
            <figure className="mb-12">
              <div 
                className="overflow-hidden"
                style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
              >
                <img
                  src={`/content/posts/${post.slug}/${post.cover}`}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            </figure>
          )}

          {/* 多媒体资源区 */}
          {(post.resources?.video || post.resources?.audio || post.resources?.slides) && (
            <div className="mb-12 space-y-6">
              {post.resources?.video && (
                <VideoPlayer
                  src={`/content/posts/${post.slug}/${post.resources.video}`}
                  title="视频讲解"
                />
              )}

              {post.resources?.audio && (
                <AudioPlayer
                  src={`/content/posts/${post.slug}/${post.resources.audio}`}
                  title="音频讲解"
                />
              )}

              {post.resources?.slides && (
                <PDFViewerTrigger
                  src={`/content/posts/${post.slug}/${post.resources.slides}`}
                  title="PPT 幻灯片"
                  slug={post.slug}
                />
              )}
            </div>
          )}

          {/* 文章正文 */}
          <ArticleWithReadingFeatures htmlContent={post.htmlContent} />

          {/* 思维导图 */}
          {post.resources?.mindmap && (
            <MindMapViewer
              src={`/content/posts/${post.slug}/${post.resources.mindmap}`}
              title="思维导图"
            />
          )}

          {/* 问答卡片 */}
          {post.resources?.flashcards && (
            <FlashcardsViewer
              src={`/content/posts/${post.slug}/${post.resources.flashcards}`}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}