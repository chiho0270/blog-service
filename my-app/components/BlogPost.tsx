"use client";

import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Bookmark } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { CommentSection } from './CommentSection';
import type { Post } from '../types/blog';

interface BlogPostProps {
  post: Post;
  onBack: () => void;
}

export function BlogPost({ post, onBack }: BlogPostProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim() || 'javascript';
        const code = lines.slice(1, -1).join('\n');
        
        return <CodeBlock key={index} code={code} language={language} />;
      }
      
      // Process markdown-style content
      const processedPart = part
        .split('\n')
        .map((line, lineIndex) => {
          // Headings
          if (line.startsWith('## ')) {
            return <h2 key={lineIndex} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={lineIndex} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.replace('### ', '')}</h3>;
          }
          
          // Lists
          if (line.startsWith('- ')) {
            return (
              <li key={lineIndex} className="ml-6 mb-2 text-gray-700 leading-relaxed">
                {line.replace('- ', '')}
              </li>
            );
          }
          
          // Checkboxes
          if (line.match(/^- [✅❌]/)) {
            const isChecked = line.includes('✅');
            return (
              <li key={lineIndex} className="ml-6 mb-2 flex items-center gap-2">
                <span className={isChecked ? 'text-green-600' : 'text-red-600'}>{isChecked ? '✅' : '❌'}</span>
                <span className="text-gray-700">{line.replace(/^- [✅❌] /, '')}</span>
              </li>
            );
          }
          
          // Tables
          if (line.startsWith('|')) {
            return null; // Handle tables separately
          }
          
          // Inline code
          const withInlineCode = line.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono">$1</code>');
          
          // Paragraphs
          if (line.trim()) {
            return <p key={lineIndex} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: withInlineCode }} />;
          }
          
          return null;
        })
        .filter(Boolean);
      
      return <div key={index}>{processedPart}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to all posts
          </button>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Series Badge */}
          {post.series && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Series: {post.series}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              {showShareMenu && (
                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px]">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Twitter</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">LinkedIn</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Copy Link</button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-yellow-50 text-yellow-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-2">Overview</h2>
            <p className="text-gray-700 leading-relaxed">{post.overview}</p>
          </div>

          {/* Body */}
          <div className="prose prose-lg max-w-none mb-8">
            {renderContent(post.body)}
          </div>

          {/* Conclusion */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-2">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed">{post.conclusion}</p>
          </div>

          {/* References */}
          {post.references.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">References & Further Reading</h2>
              <ul className="space-y-2">
                {post.references.map((ref, index) => (
                  <li key={index}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {ref.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          <CommentSection postId={post.id} />
        </div>
      </article>
    </div>
  );
}
