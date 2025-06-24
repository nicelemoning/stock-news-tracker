// app/layout.tsx
import './globals.css'; // 如果你有全局样式
import React from 'react';

export const metadata = {
  title: 'Stock News Tracker',
  description: 'Track latest news by stock ticker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
