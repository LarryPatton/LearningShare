import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// 分类元数据映射
const CATEGORY_META: Record<string, { name: string; description: string }> = {
  'ai': {
    name: 'AI',
    description: '探索人工智能、机器学习、深度学习等前沿技术',
  },
  'coding': {
    name: 'Coding',
    description: '分享编程技术、设计模式、算法和最佳实践',
  },
  'game': {
    name: 'Game',
    description: '游戏设计、开发技术和行业洞察',
  },
  'mkt': {
    name: 'Marketing',
    description: '数字营销、SEO优化和内容营销策略',
  },
  'startup': {
    name: 'Startup',
    description: '创业经验、商业模式和融资策略',
  },
  'personal-growth': {
    name: 'Growth',
    description: '效率提升、学习方法和职业发展',
  },
  'management': {
    name: 'Management',
    description: '团队管理、项目管理和领导力培养',
  },
  'finance': {
    name: 'Finance',
    description: '投资理财、股票市场和财富管理',
  },
  'social': {
    name: 'Social',
    description: '沟通技巧、人际关系和社交网络',
  },
  'politics': {
    name: 'Politics',
    description: '时事分析、政策解读和国际关系',
  }
};

export async function generateStaticParams() {
  const allCategorySlugs = Object.keys(CATEGORY_META);
  return allCategorySlugs.map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const categorySlug = params.slug;
  const categoryMeta = CATEGORY_META[categorySlug];
  
  if (!categoryMeta) {
    notFound();
  }
  
  const posts = await getPostsByCategory(categorySlug);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 分类标题区 */}
      <header className="py-16 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container-wide">
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
          
          <h1 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {categoryMeta.name}
          </h1>
          <p 
            className="text-lg max-w-2xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {categoryMeta.description}
          </p>
          <div 
            className="mt-6 text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            共 {posts.length} 篇文章
          </div>
        </div>
      </header>

      {/* 文章列表 */}
      <main className="flex-1 py-16">
        <div className="container-wide">
          {posts.length > 0 ? (
            <div className="space-y-0">
              {posts.map((post) => (
                <Link key={post.slug} href={`/articles/${post.slug}`}>
                  <article 
                    className="group py-8 border-b transition-colors"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* 封面图 */}
                      {post.cover && (
                        <div className="lg:w-48 flex-shrink-0">
                          <div 
                            className="aspect-video lg:aspect-square overflow-hidden"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                          >
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
                        {/* 子分类和日期 */}
                        <div className="flex items-center gap-3 mb-3">
                          {post.subcategory && (
                            <>
                              <span 
                                className="text-xs font-medium uppercase tracking-wider"
                                style={{ color: 'var(--color-text-tertiary)' }}
                              >
                                {post.subcategory}
                              </span>
                              <span style={{ color: 'var(--color-border)' }}>·</span>
                            </>
                          )}
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {post.date}
                          </span>
                        </div>

                        {/* 标题 */}
                        <h2 
                          className="text-xl md:text-2xl font-semibold mb-3 transition-opacity group-hover:opacity-70"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {post.title}
                        </h2>

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
          ) : (
            <div className="text-center py-20">
              <p style={{ color: 'var(--color-text-tertiary)' }}>该分类暂无文章</p>
              <Link 
                href="/"
                className="mt-4 inline-block transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                返回首页查看其他分类
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}