import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我的技术博客',
  description: '分享技术文章、编程经验和学习笔记',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
