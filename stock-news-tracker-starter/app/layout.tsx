// app/layout.tsx
export const metadata = {
  title: 'Stock News Tracker',
  description: 'Track latest news by stock ticker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
