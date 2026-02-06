import { Tag, TrendingUp, BookOpen } from 'lucide-react';

interface SidebarProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  totalPosts: number;
}

export function Sidebar({ tags, selectedTag, onSelectTag, totalPosts }: SidebarProps) {
  const popularTopics = [
    'API Design',
    'Performance',
    'Security',
    'Database',
  ];

  return (
    <div className="space-y-6">
      {/* About */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">블로그 소개</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Backend 개발, System Design, Engineering Best Practices에 대한 심층 기술 아티클을 제공합니다.
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
          <div className="text-sm text-gray-600">Published Articles</div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-900">인기 토픽</h3>
        </div>
        <div className="space-y-2">
          {popularTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => onSelectTag(topic)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedTag === topic
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* All Tags */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-900">All Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectTag(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            전체
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="font-bold mb-2">주간 업데이트 받기</h3>
        <p className="text-sm mb-4 text-blue-100">
          최신 Backend 개발 팁과 튜토리얼을 이메일로 받아보세요.
        </p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg text-gray-900 mb-2 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
}
