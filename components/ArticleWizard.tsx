import React, { useState } from 'react';
import { ArticleLength, ArticleState, TargetAudience, Tone } from '../types';
import { FileText, Key, Sparkles } from 'lucide-react';

interface ArticleWizardProps {
  onGenerate: (state: ArticleState) => void;
  isGenerating: boolean;
}

const ArticleWizard: React.FC<ArticleWizardProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('Tratamento para Artrose');
  const [keywords, setKeywords] = useState('Artrose, Joelho, Tratamento');
  const [length, setLength] = useState<ArticleLength>(ArticleLength.MEDIUM);
  const [audience, setAudience] = useState<TargetAudience>(TargetAudience.PATIENT);
  const [tone, setTone] = useState<Tone>(Tone.EMPATHETIC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ topic, keywords, length, audience, tone });
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            {/* Column 1 */}
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tema Principal</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Palavras-Chave</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
                        />
                    </div>
                </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Público-Alvo</label>
                    <select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value as TargetAudience)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700"
                    >
                         {Object.values(TargetAudience).map(a => (
                            <option key={a} value={a}>{a}</option>
                         ))}
                    </select>
                </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Extensão</label>
                    <select
                        value={length}
                        onChange={(e) => setLength(e.target.value as ArticleLength)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700"
                    >
                         {Object.values(ArticleLength).map(l => (
                            <option key={l} value={l}>{l}</option>
                         ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tom de Voz</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(Tone).slice(0, 4).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTone(t)}
                                className={`px-3 py-2 text-sm border rounded-lg transition-colors
                                ${tone === t ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 hover:border-blue-300 text-slate-600 bg-white'}`}
                            >
                                {t.split('/')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <button 
                type="submit"
                disabled={isGenerating || !topic}
                className={`w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-500/20 transform active:scale-[0.99] transition-all flex items-center justify-center text-lg
                ${(isGenerating || !topic) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isGenerating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Escrevendo...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Artigo SEO
                    </>
                )}
            </button>
        </div>
    </form>
  );
};

export default ArticleWizard;