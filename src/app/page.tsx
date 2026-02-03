import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryNav } from '@/components/CategoryNav';

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container-wide">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Learning Share
          </h1>
          <p 
            className="text-lg md:text-xl max-w-2xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            分享知识，记录成长 — 涵盖 AI、编程、创业、个人成长等多个领域的学习笔记与思考
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="container-wide">
          {/* 分类导航 */}
          <CategoryNav />

          {/* 文章列表 */}
          <section>
            <h2 
              className="text-sm font-medium uppercase tracking-wider mb-8"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              最新文章
            </h2>

            <div className="space-y-0">
              {posts.map((post, index) => (
                <Link key={post.slug} href={`/articles/${post.slug}`}>
                  <article 
                    className="group py-8 border-b transition-colors"
                    style={{ 
                      borderColor: 'var(--color-border)',
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* 封面图 */}
                      {post.cover && (
                        <div className="lg:w-48 flex-shrink-0">
                          <div className="aspect-video lg:aspect-square overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                            <img
                              src={`/content/posts/${post.slug}/${post.cover}`}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </div>
                      )}

                      {/* 文章信息 */}
                      <div className="flex-1 min-w-0">
                        {/* 分类和日期 */}
                        <div className="flex items-center gap-3 mb-3">
                          <span 
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {post.category}
                          </span>
                          <span style={{ color: 'var(--color-border)' }}>·</span>
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {post.date}
                          </span>
                        </div>

                        {/* 标题 */}
                        <h3 
                          className="text-xl md:text-2xl font-semibold mb-3 transition-opacity group-hover:opacity-70"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {post.title}
                        </h3>

                        {/* 摘要 */}
                        <p 
                          className="text-base mb-4 line-clamp-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {post.excerpt}
                        </p>

                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* 多媒体标识 */}
                        {post.resources && (
                          <div className="flex gap-4 mt-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            {post.resources.video && <span>▶ 视频</span>}
                            {post.resources.audio && <span>♫ 音频</span>}
                            {post.resources.slides && <span>◧ PPT</span>}
                            {post.resources.mindmap && <span>◎ 导图</span>}
                          </div>
                        )}
                      </div>

                      {/* 箭头 */}
                      <div 
                        className="hidden lg:flex items-center self-center transition-transform group-hover:translate-x-2"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* 空状态 */}
            {posts.length === 0 && (
              <div className="text-center py-20">
                <p style={{ color: 'var(--color-text-tertiary)' }}>暂无文章</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}