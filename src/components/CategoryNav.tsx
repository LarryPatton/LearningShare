'use client';

import Link from 'next/link';

// 分类配置 - 极简专业风格
const CATEGORIES = [
  { slug: 'ai', name: 'AI', fullName: '人工智能' },
  { slug: 'coding', name: 'Coding', fullName: '编程开发' },
  { slug: 'game', name: 'Game', fullName: '游戏' },
  { slug: 'mkt', name: 'Marketing', fullName: '营销' },
  { slug: 'startup', name: 'Startup', fullName: '创业' },
  { slug: 'personal-growth', name: 'Growth', fullName: '个人成长' },
  { slug: 'management', name: 'Management', fullName: '管理' },
  { slug: 'finance', name: 'Finance', fullName: '金融' },
  { slug: 'social', name: 'Social', fullName: '社交' },
  { slug: 'politics', name: 'Politics', fullName: '时政' }
];

export function CategoryNav() {
  return (
    <section className="mb-16">
      <h2 
        className="text-sm font-medium uppercase tracking-wider mb-6"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        浏览分类
      </h2>
      
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group"
          >
            <div 
              className="px-4 py-2 border transition-all duration-200 hover:border-current"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <span className="text-sm font-medium group-hover:opacity-70 transition-opacity">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}