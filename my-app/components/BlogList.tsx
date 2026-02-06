import { Calendar, Clock, Tag } from 'lucide-react';
import type { Post } from '../types/blog';

interface BlogListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export function BlogList({ posts, onSelectPost }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">검색 조건에 맞는 포스트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-200"
          onClick={() => onSelectPost(post)}
        >
          <div className="p-6">
            {/* Series Badge */}
            {post.series && (
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Series: {post.series}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
              {post.title}
            </h2>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time>{new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}분 읽기</span>
              </div>
              <div className="flex items-center gap-1">
                <span>By {post.author}</span>
              </div>
            </div>

            {/* Overview */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {post.overview}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Read More Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
              전체 아티클 읽기 →
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
