import React from 'react';
import { GeneratedArticle } from '../types';

interface ArticlePreviewProps {
  article: GeneratedArticle;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <div className="w-full h-full bg-white shadow-lg rounded-xl border border-slate-200 overflow-hidden flex flex-col font-sans">
        {/* Mac-like Window Header */}
        <div className="h-8 bg-slate-50 border-b border-slate-200 flex items-center px-4 space-x-2 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
            <div className="text-xs font-bold text-blue-600 uppercase mb-2 tracking-wide">SEO Score: 98/100</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">{article.title}</h1>
            
            <div className="flex gap-2 mb-6">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-medium border border-slate-200">Word Count: {article.wordCount}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-medium border border-slate-200">Slug: /{article.slug}</span>
            </div>

            <div className="prose prose-sm text-slate-600 max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Sugestões de SEO</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-500">
                    {article.seoSuggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default ArticlePreview;