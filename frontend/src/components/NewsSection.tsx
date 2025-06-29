import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import type { NewsArticle } from '../types';
import instance from '../utils/Axios';

const NewsSection: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const fetchNews = async (): Promise<void> => {
    setLoading(true);
    setNewsError(null);
    
    try {
      let khabar = await instance.get('/news', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(khabar);
      setNewsArticles(khabar.data.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsError('Failed to load news articles. Please try again later.');
    }
    finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    // Handle Serper's date format (e.g., "4 months ago", "6 months ago")
    if (dateString.includes('ago')) {
      return dateString;
    }
    
    // Fallback for standard date format
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Legal News</h1>
        <p className="text-gray-600">Stay updated with the latest legal developments</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading legal news...</span>
        </div>
      ) : newsError ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{newsError}</div>
          <button 
            onClick={fetchNews}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article, index) => (
            <div key={`${article.source}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={article.imageUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop"}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop";
                }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {article.source}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(article.date)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.snippet}
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read More
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;