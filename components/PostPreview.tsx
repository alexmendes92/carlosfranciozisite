import React, { useState, useEffect } from 'react';
import { GeneratedResult } from '../types';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Check, Edit2, Wand2 } from 'lucide-react';
import { refinePostCaption } from '../services/geminiService';

interface PostPreviewProps {
  result: GeneratedResult;
  onRegenerateText: () => void;
  onRegenerateImage: () => void;
  isRegenerating: boolean;
}

const PostPreview: React.FC<PostPreviewProps> = ({ 
  result, 
  onRegenerateText, 
  onRegenerateImage,
  isRegenerating 
}) => {
  const { content, imageUrl } = result;
  
  // Editable State
  const [editableCaption, setEditableCaption] = useState(content?.caption || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    if (content?.caption) setEditableCaption(content.caption);
  }, [content]);

  const handleSmartRefine = async (instruction: string) => {
    setIsRefining(true);
    try {
        const newText = await refinePostCaption(editableCaption, instruction);
        setEditableCaption(newText);
    } catch (error) {
        console.error("Refine failed", error);
    } finally {
        setIsRefining(false);
    }
  };

  return (
    <div className="animate-fadeIn w-full max-w-[350px] mx-auto pb-12">
        
        {/* PHONE FRAME */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-slate-900 relative aspect-[9/19.5]">
            
            {/* Top Bar (Mock) */}
            <div className="h-10 bg-white flex items-center justify-between px-6 pt-2 select-none">
                <span className="text-xs font-bold text-slate-900">9:41</span>
                <div className="flex gap-1">
                    <div className="w-4 h-2.5 bg-slate-900 rounded-[1px]"></div>
                </div>
            </div>

            {/* Instagram Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-50 bg-white z-10 relative">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                             <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=DrCarlos" className="w-full h-full rounded-full bg-slate-100" />
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">dr.carlos_franciozi</span>
                 </div>
                 <MoreHorizontal className="w-5 h-5 text-slate-900" />
            </div>

            {/* Content Container (Scrollable) */}
            <div className="h-[calc(100%-6rem)] overflow-y-auto no-scrollbar bg-white">
                
                {/* Image Area */}
                <div className="relative w-full aspect-square bg-slate-100">
                    {imageUrl ? (
                        <img src={imageUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sem Imagem</div>
                    )}
                    {result.isCustomImage && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-bold">
                            Imagem Real
                        </div>
                    )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex gap-4 text-slate-900">
                        <Heart className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
                        <MessageCircle className="w-6 h-6 -rotate-90" />
                        <Send className="w-6 h-6" />
                    </div>
                    <Bookmark className="w-6 h-6 text-slate-900" />
                </div>

                {/* Caption Area */}
                <div className="px-4 pb-20">
                    <p className="text-xs font-bold text-slate-900 mb-2">324 curtidas</p>
                    
                    <div className="relative group">
                        {isEditing ? (
                            <div className="relative">
                                <textarea 
                                    value={editableCaption}
                                    onChange={(e) => setEditableCaption(e.target.value)}
                                    className="w-full h-64 text-xs leading-relaxed p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                />
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-md"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-xs leading-relaxed text-slate-800">
                                <span className="font-bold mr-2">dr.carlos_franciozi</span>
                                <span className="whitespace-pre-wrap">{editableCaption}</span>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="ml-2 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit2 className="w-3 h-3 inline mr-1" /> Editar
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Hashtags */}
                    {content?.hashtags && !isEditing && (
                        <p className="text-[11px] text-blue-900 mt-2 font-medium leading-relaxed">
                            {content.hashtags.join(' ')}
                        </p>
                    )}
                </div>
            </div>

            {/* Smart Refine Tools (Floating) */}
            {!isEditing && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-xl p-2 z-20 flex gap-2 overflow-x-auto no-scrollbar">
                    {isRefining ? (
                         <div className="w-full text-center text-xs font-bold text-slate-500 py-2">Refinando...</div>
                    ) : (
                        <>
                            <button onClick={() => handleSmartRefine("Mais curto e direto")} className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 whitespace-nowrap">
                                ✂️ Encurtar
                            </button>
                            <button onClick={() => handleSmartRefine("Mais empático e acolhedor")} className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 whitespace-nowrap">
                                ❤️ Mais Empático
                            </button>
                            <button onClick={() => handleSmartRefine("Adicionar emojis relevantes")} className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 whitespace-nowrap">
                                😊 Emojis
                            </button>
                             <button onClick={() => handleSmartRefine("Traduzir termos médicos para linguagem leiga")} className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 whitespace-nowrap">
                                🧠 Simplificar
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/20 rounded-full z-30"></div>
        </div>

    </div>
  );
};

export default PostPreview;