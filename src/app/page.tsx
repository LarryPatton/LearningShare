import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            📚 我的技术博客
          </h1>
          <p className="text-gray-600 mt-2">
            分享技术文章、编程经验和学习笔记
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
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
                    <span>🏷️ {post.category}</span>
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

        {/* 空状态 */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">暂无文章</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p>© 2024 我的技术博客. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
