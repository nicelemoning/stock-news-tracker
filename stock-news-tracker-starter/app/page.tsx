'use client'

import { useState } from 'react'

export default function Home() {
  const [ticker, setTicker] = useState('')
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/fetch-news?ticker=${ticker}`)
      const data = await response.json()
      setNews(data.articles || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Stock News Tracker</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter stock ticker (e.g. TSLA)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          style={{
            padding: '0.5rem',
            marginRight: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button onClick={fetchNews} disabled={loading} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          {loading ? 'Loading...' : 'Fetch News'}
        </button>
      </div>
      <ul>
        {news.map((article, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <strong>{article.title}</strong>
            </a>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
