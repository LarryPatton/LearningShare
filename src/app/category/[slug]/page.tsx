import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 分类元数据映射
const CATEGORY_META = {
  'ai': {
    name: 'AI 人工智能',
    icon: '🤖',
    description: '探索人工智能、机器学习、深度学习等前沿技术',
    color: 'from-purple-500 to-pink-500'
  },
  'coding': {
    name: 'Coding 编程技术',
    icon: '💻',
    description: '分享编程技术、设计模式、算法和最佳实践',
    color: 'from-blue-500 to-cyan-500'
  },
  'game': {
    name: 'GAME 游戏',
    icon: '🎮',
    description: '游戏设计、开发技术和行业洞察',
    color: 'from-green-500 to-teal-500'
  },
  'mkt': {
    name: 'MKT 市场营销',
    icon: '📊',
    description: '数字营销、SEO优化和内容营销策略',
    color: 'from-orange-500 to-red-500'
  },
  'startup': {
    name: '创业',
    icon: '🚀',
    description: '创业经验、商业模式和融资策略',
    color: 'from-yellow-500 to-orange-500'
  },
  'personal-growth': {
    name: '个人成长',
    icon: '🌱',
    description: '效率提升、学习方法和职业发展',
    color: 'from-green-500 to-emerald-500'
  },
  'management': {
    name: '管理',
    icon: '👔',
    description: '团队管理、项目管理和领导力培养',
    color: 'from-indigo-500 to-purple-500'
  },
  'finance': {
    name: '金融',
    icon: '💰',
    description: '投资理财、股票市场和财富管理',
    color: 'from-yellow-500 to-green-500'
  },
  'social': {
    name: '社交',
    icon: '👥',
    description: '沟通技巧、人际关系和社交网络',
    color: 'from-pink-500 to-rose-500'
  },
  'politics': {
    name: '时政',
    icon: '🌍',
    description: '时事分析、政策解读和国际关系',
    color: 'from-gray-500 to-slate-500'
  }
};

export async function generateStaticParams() {
  // 返回所有预定义的分类，确保即使没有文章也能生成页面
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
  const categoryMeta = CATEGORY_META[categorySlug as keyof typeof CATEGORY_META];
  
  if (!categoryMeta) {
    notFound();
  }
  
  const posts = await getPostsByCategory(categorySlug);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            ← 返回首页
          </Link>
          
          {/* 分类标题和描述 */}
          <div className={`bg-gradient-to-r ${categoryMeta.color} rounded-lg p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{categoryMeta.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {categoryMeta.name}
                </h1>
                <p className="text-white/90 mt-2">
                  {categoryMeta.description}
                </p>
              </div>
            </div>
            <div className="text-sm text-white/80">
              共 {posts.length} 篇文章
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/articles/${post.slug}`}
                className="group"
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full">
                  {/* 封面图 */}
                  {post.cover && (
                    <div className="aspect-video overflow-hidden bg-gray-200">
                      <img
                        src={`/content/posts/${post.slug}/${post.cover}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* 子分类标签 */}
                    {post.subcategory && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          📂 {post.subcategory}
                        </span>
                      </div>
                    )}

                    {/* 标题 */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* 摘要 */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* 元信息 */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                      <span>📅 {post.date}</span>
                      <span>👤 {post.author}</span>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 多媒体标识 */}
                    {post.resources && (
                      <div className="mt-4 pt-4 border-t flex gap-3 text-xs text-gray-500">
                        {post.resources.video && <span>🎥 视频</span>}
                        {post.resources.audio && <span>🎧 音频</span>}
                        {post.resources.slides && <span>📄 PPT</span>}
                        {post.resources.mindmap && <span>🗺️ 导图</span>}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">该分类暂无文章</p>
            <Link 
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              返回首页查看其他分类
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
