import { NextRequest, NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get('ticker') || 'TSLA';
  const query = `${ticker} OR ${ticker.toUpperCase()}`;
  const fromDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${fromDate}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;

  const newsRes = await fetch(newsUrl);
  const newsJson = await newsRes.json();

  if (!newsJson.articles) return NextResponse.json([]);

  const results = await Promise.all(
    newsJson.articles.map(async (article: any) => {
      const prompt = `请总结以下新闻内容，并判断其情绪是积极、消极或中性。\n\n标题：${article.title}\n内容：${article.description}\n\n请输出：\n摘要：xxx\n情绪：xxx（积极/消极/中性）`;

      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: '你是一个财经新闻分析专家。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      const gptResult = await completion.json();
      const reply = gptResult.choices?.[0]?.message?.content || '';

      const summaryMatch = reply.match(/摘要[:：](.*)/);
      const sentimentMatch = reply.match(/情绪[:：](.*)/);

      return {
        title: article.title,
        url: article.url,
        summary: summaryMatch ? summaryMatch[1].trim() : '',
        sentiment: sentimentMatch ? sentimentMatch[1].trim() : '中性'
      };
    })
  );

  return NextResponse.json(results);
}
