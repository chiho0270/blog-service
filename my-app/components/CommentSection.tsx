"use client";

import { useState } from 'react';
import { MessageCircle, ThumbsUp, Reply } from 'lucide-react';
import type { Comment } from '../types/blog';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'David Kim',
      date: '2026-02-06',
      content: 'Great article! The pagination example using cursor-based approach is exactly what I needed. Have you considered adding an example with GraphQL connections?',
    },
    {
      id: '2',
      author: 'Emma Watson',
      date: '2026-02-05',
      content: 'The rate limiting implementation is clean. We\'re using a similar approach at work but with a sliding window algorithm. Would love to see a comparison!',
      replies: [
        {
          id: '2-1',
          author: 'Alex Chen',
          date: '2026-02-05',
          content: 'Thanks Emma! That\'s a great suggestion. I\'ll add a follow-up post comparing different rate limiting algorithms.',
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      date: new Date().toISOString().split('T')[0],
      content: newComment,
    };

    setComments([...comments, comment]);
    setNewComment('');
    setReplyTo(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-gray-500">
            💡 Tip: Use markdown for code blocks with triple backticks
          </p>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {comment.author[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Like
                  </button>
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 pl-4 border-l-2 border-blue-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {reply.author[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{reply.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          💬 <strong>Production Ready:</strong> Integrate with{' '}
          <a href="https://utteranc.es/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Utterances
          </a>,{' '}
          <a href="https://giscus.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Giscus
          </a>, or{' '}
          <a href="https://disqus.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Disqus
          </a>{' '}
          for production comments powered by GitHub Discussions or traditional databases.
        </p>
      </div>
    </div>
  );
}
