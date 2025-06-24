'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [ticker, setTicker] = useState('TSLA');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch(`/api/fetch-news?ticker=${ticker}`);
    const data = await res.json();
    setNews(data);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stock News Tracker</h1>
      <div className="flex gap-2">
        <Input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="Enter Stock Ticker" />
        <Button onClick={fetchNews} disabled={loading}>{loading ? 'Loading...' : 'Fetch News'}</Button>
      </div>

      <div className="space-y-4">
        {news.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">Sentiment: {item.sentiment}</p>
              <p className="mt-2">{item.summary}</p>
              <a href={item.url} target="_blank" className="text-blue-500 underline mt-2 inline-block">Read More</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}