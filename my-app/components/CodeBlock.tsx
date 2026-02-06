"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting for common tokens
  const highlightCode = (code: string, lang: string) => {
    let highlighted = code;
    
    // Keywords
    const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'from', 'export', 'default', 'new', 'try', 'catch', 'throw', 'SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'CREATE', 'TABLE', 'INDEX', 'ALTER'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-purple-600 font-semibold">${keyword}</span>`);
    });
    
    // Strings
    highlighted = highlighted.replace(/(['"`])(.*?)\1/g, '<span class="text-green-600">$1$2$1</span>');
    
    // Comments
    highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span class="text-gray-500 italic">//$1</span>');
    highlighted = highlighted.replace(/\/\*(.*?)\*\//gs, '<span class="text-gray-500 italic">/*$1*/</span>');
    
    // Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-blue-600">$1</span>');
    
    return highlighted;
  };

  return (
    <div className="relative my-6 rounded-lg overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors rounded hover:bg-gray-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm">
          <code 
            className="text-gray-100 font-mono"
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
          />
        </pre>
      </div>
    </div>
  );
}
