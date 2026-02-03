'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeProvider';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ 
      backgroundColor: 'var(--color-bg)', 
      borderColor: 'var(--color-border)' 
    }}>
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Learning Share
            </span>
          </Link>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
