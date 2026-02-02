import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { VideoPlayer } from '@/components/VideoPlayer';
import { AudioPlayer } from '@/components/AudioPlayer';
import { PDFViewerTrigger } from '@/components/PDFViewerTrigger';
import { MindMapViewer } from '@/components/MindMapViewer';
import { FlashcardsViewer } from '@/components/FlashcardsViewer';
import { ArticleWithReadingFeatures } from '@/components/ArticleWithReadingFeatures';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 封面图 */}
        {post.cover && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={`/content/posts/${post.slug}/${post.cover}`}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* 文章标题和元信息 */}
        <article className="bg-white rounded-lg shadow-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <span className="flex items-center gap-1">
              👤 {post.author}
            </span>
            <span className="flex items-center gap-1">
              📅 {post.date}
            </span>
            <span className="flex items-center gap-1">
              🏷️ {post.category}
            </span>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 多媒体资源区（视频、音频、PPT） */}
          {(post.resources?.video || post.resources?.audio || post.resources?.slides) && (
            <div className="mb-8 space-y-4">
              {/* 视频 */}
              {post.resources?.video && (
                <VideoPlayer
                  src={`/content/posts/${post.slug}/${post.resources.video}`}
                  title="视频讲解"
                />
              )}

              {/* 音频 */}
              {post.resources?.audio && (
                <AudioPlayer
                  src={`/content/posts/${post.slug}/${post.resources.audio}`}
                  title="音频讲解"
                />
              )}

              {/* PDF 幻灯片（点击按钮查看） */}
              {post.resources?.slides && (
                <PDFViewerTrigger
                  src={`/content/posts/${post.slug}/${post.resources.slides}`}
                  title="PPT 幻灯片"
                  slug={post.slug}
                />
              )}
            </div>
          )}

          {/* 文章正文（带阅读进度和目录导航） */}
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
        </article>
      </main>
    </div>
  );
}
