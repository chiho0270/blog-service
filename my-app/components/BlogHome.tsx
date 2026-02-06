import { useState } from 'react';
import { BlogPost } from './BlogPost';
import { SearchBar } from './SearchBar';
import { Sidebar } from './Sidebar';
import { BlogList } from './BlogList';
import { RSSFeed } from './RSSFeed';
import { samplePosts } from '../data/sample-posts';
import type { Post } from '../types/blog';

export function BlogHome() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showRSS, setShowRSS] = useState(false);

  // Filter posts based on search and tags
  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(samplePosts.flatMap(post => post.tags)));

  if (showRSS) {
    return <RSSFeed posts={samplePosts} onClose={() => setShowRSS(false)} />;
  }

  if (selectedPost) {
    return <BlogPost post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Backend Dev Blog</h1>
              <p className="text-gray-600 mt-1">Deep dives into API design, database optimization, and server architecture</p>
            </div>
            <button
              onClick={() => setShowRSS(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
                <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"/>
              </svg>
              RSS Feed
            </button>
          </div>
          
          <div className="mt-6">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Posts List */}
          <div className="lg:col-span-3">
            <BlogList 
              posts={filteredPosts} 
              onSelectPost={setSelectedPost}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              totalPosts={samplePosts.length}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2026 Backend Dev Blog. Built with Next.js, Markdown, and passion for clean code.</p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <a href="#" className="hover:text-gray-900">About</a>
              <a href="#" className="hover:text-gray-900">Archive</a>
              <a href="#" className="hover:text-gray-900">GitHub</a>
              <a href="#" className="hover:text-gray-900">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
