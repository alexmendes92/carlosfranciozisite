import React, { useState } from 'react';
import { ConversionState, ConversionFormat } from '../types';
import { Video, FileText, Target, AlertTriangle, PlayCircle, BookOpen } from 'lucide-react';

interface ConversionWizardProps {
  onGenerate: (state: ConversionState) => void;
  isGenerating: boolean;
}

const ConversionWizard: React.FC<ConversionWizardProps> = ({ onGenerate, isGenerating }) => {
  const [pathology, setPathology] = useState('Artrose de Joelho');
  const [objection, setObjection] = useState('Medo de que a prótese não dure');
  const [format, setFormat] = useState<ConversionFormat>('REELS');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ pathology, objection, format });
  };

  const pathologies = [
    "Artrose de Joelho",
    "Condromalácia Patelar",
    "Lesão de Menisco",
    "Ruptura de LCA",
    "Artrose de Quadril"
  ];

  const objections = [
    "Medo da dor pós-operatória",
    "Medo de ficar 'travado' ou pior",
    "Achar que é 'muito novo' para prótese",
    "Achar que é 'muito velho' para operar",
    "Custo da cirurgia / Convênio não cobre",
    "Tempo longo de recuperação"
  ];

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn space-y-8">
        
        {/* Header */}
        <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-red-600" />
                Estratégia de Conversão
            </h2>
            <p className="text-xs text-slate-500">Ferramenta focada em quebrar objeções e agendar cirurgias.</p>
        </div>

        {/* Pathologies */}
        <section>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Patologia Foco</label>
            <div className="flex flex-wrap gap-2">
                {pathologies.map(p => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setPathology(p)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all border
                        ${pathology === p 
                            ? 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-red-200'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>
            <input 
                type="text"
                value={pathology}
                onChange={(e) => setPathology(e.target.value)}
                placeholder="Ou digite outra..."
                className="mt-3 w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-red-400 transition-colors"
            />
        </section>

        {/* Objections */}
        <section>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> Objeção do Paciente
            </label>
            <select
                value={objection}
                onChange={(e) => setObjection(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-100"
            >
                {objections.map(obj => (
                    <option key={obj} value={obj}>{obj}</option>
                ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-2 italic">A IA usará psicologia comportamental para reverter este pensamento.</p>
        </section>

        {/* Format Selection */}
        <section>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Formato de Saída</label>
            <div className="grid grid-cols-2 gap-4">
                <div 
                    onClick={() => setFormat('REELS')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-2
                    ${format === 'REELS' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                    <PlayCircle className={`w-8 h-8 ${format === 'REELS' ? 'text-red-600' : 'text-slate-400'}`} />
                    <div>
                        <span className="block font-bold text-sm text-slate-800">Roteiro Reels</span>
                        <span className="block text-[10px] text-slate-500">Vídeo Curto (60s)</span>
                    </div>
                </div>

                <div 
                    onClick={() => setFormat('DEEP_ARTICLE')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-2
                    ${format === 'DEEP_ARTICLE' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                    <BookOpen className={`w-8 h-8 ${format === 'DEEP_ARTICLE' ? 'text-red-600' : 'text-slate-400'}`} />
                    <div>
                        <span className="block font-bold text-sm text-slate-800">Artigo Profundo</span>
                        <span className="block text-[10px] text-slate-500">Blog / Newsletter</span>
                    </div>
                </div>
            </div>
        </section>

        <button 
            type="submit"
            disabled={isGenerating}
            className={`w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transform active:scale-[0.99] transition-all flex items-center justify-center text-lg mt-4
            ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isGenerating ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Analisando Objeção...
                </>
            ) : (
                <>
                    <Target className="w-5 h-5 mr-2" />
                    Gerar Estratégia
                </>
            )}
        </button>
    </form>
  );
};

export default ConversionWizard;