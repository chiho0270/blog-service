"use client";

import { X, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Post } from '../types/blog';

interface RSSFeedProps {
  posts: Post[];
  onClose: () => void;
}

export function RSSFeed({ posts, onClose }: RSSFeedProps) {
  const [copied, setCopied] = useState(false);

  const generateRSS = () => {
    const rssItems = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>https://your-blog.com/posts/${post.id}</link>
      <description>${post.overview}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
      <guid>https://your-blog.com/posts/${post.id}</guid>
    </item>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Backend Dev Blog</title>
    <link>https://your-blog.com</link>
    <description>Deep dives into API design, database optimization, and server architecture</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://your-blog.com/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;
  };

  const rssContent = generateRSS();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rssContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rssContent], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feed.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">RSS Feed</h2>
              <p className="text-gray-600 mt-1">Subscribe to get updates in your favorite RSS reader</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Feed URL'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download XML
              </button>
            </div>
          </div>

          {/* RSS Content */}
          <div className="p-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-400 font-mono">feed.xml</span>
              </div>
              <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                <code>{rssContent}</code>
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">How to Subscribe</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Popular RSS Readers:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Feedly:</strong> Paste the feed URL in the search bar</li>
                  <li>• <strong>Inoreader:</strong> Click "Add subscription" and paste the URL</li>
                  <li>• <strong>NewsBlur:</strong> Use the "Add Site" button</li>
                  <li>• <strong>RSS Guard:</strong> Add feed from URL</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Feed URL:</strong>{' '}
                  <code className="px-2 py-1 bg-white rounded text-blue-600">
                    https://your-blog.com/rss.xml
                  </code>
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Note */}
          <div className="p-6 bg-yellow-50 border-t border-yellow-200">
            <h3 className="font-bold text-gray-900 mb-2">📝 Implementation Notes</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>For a production blog, implement RSS generation as follows:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Next.js:</strong> Use API routes to generate RSS dynamically</li>
                <li><strong>Gatsby:</strong> Use gatsby-plugin-feed</li>
                <li><strong>Hugo:</strong> Built-in RSS template support</li>
                <li><strong>Jekyll:</strong> Use jekyll-feed plugin</li>
              </ul>
              <p className="mt-3">
                Store the generated RSS file at <code className="px-1 bg-white rounded">/public/rss.xml</code> or serve it from an API endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
