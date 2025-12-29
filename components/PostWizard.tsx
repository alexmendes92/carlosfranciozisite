import React, { useState, useRef } from 'react';
import { PostCategory, Tone, PostState, PostFormat } from '../types';
import { 
    HeartPulse, 
    BriefcaseMedical, 
    Activity, 
    User, 
    ShieldCheck, 
    HelpCircle, 
    CheckCircle2, 
    Search,
    Sparkles,
    Image as ImageIcon,
    X,
    Smartphone,
    LayoutGrid
} from 'lucide-react';

interface PostWizardProps {
  onGenerate: (state: PostState) => void;
  isGenerating: boolean;
}

const PostWizard: React.FC<PostWizardProps> = ({ onGenerate, isGenerating }) => {
  const [category, setCategory] = useState<PostCategory>(PostCategory.PATHOLOGY);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [format, setFormat] = useState<PostFormat>(PostFormat.FEED);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ category, topic, tone, format, customInstructions: '', uploadedImage });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { id: PostCategory.PATHOLOGY, icon: <HeartPulse className="w-5 h-5" />, label: "Doenças", desc: "Sintomas e causas" },
    { id: PostCategory.SURGERY, icon: <BriefcaseMedical className="w-5 h-5" />, label: "Cirurgias", desc: "Pré e Pós-Op" },
    { id: PostCategory.SPORTS, icon: <Activity className="w-5 h-5" />, label: "Esporte", desc: "Performance" },
    { id: PostCategory.REHAB, icon: <User className="w-5 h-5" />, label: "Reabilitação", desc: "Fisioterapia" },
    { id: PostCategory.LIFESTYLE, icon: <ShieldCheck className="w-5 h-5" />, label: "Vida", desc: "Prevenção" },
    { id: PostCategory.MYTHS, icon: <HelpCircle className="w-5 h-5" />, label: "Mitos", desc: "Verdades" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32 lg:pb-8">
        
        {/* Step 1: Format & Image */}
        <section className="animate-slideUp" style={{ animationDelay: '0s' }}>
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-sm font-bold text-accent uppercase tracking-widest">1. Formato & Mídia</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                 <button
                    type="button"
                    onClick={() => setFormat(PostFormat.FEED)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                    ${format === PostFormat.FEED ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'}`}
                 >
                    <LayoutGrid className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Feed (Quadrado)</span>
                 </button>
                 <button
                    type="button"
                    onClick={() => setFormat(PostFormat.STORY)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                    ${format === PostFormat.STORY ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'}`}
                 >
                    <Smartphone className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Story (Vertical)</span>
                 </button>
            </div>

            {/* Image Upload Area */}
            <div className="relative">
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                />
                
                {!uploadedImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
                    >
                        <div className="text-center text-slate-400 group-hover:text-accent">
                            <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-xs font-semibold">Analisar Imagem (Raio-X, Paciente...)</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                        <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => { setUploadedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 px-3 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-accent" /> IA Analisará esta imagem
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Step 2: Category & Topic */}
        <section className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
             <h2 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">2. Conteúdo</h2>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {categories.map((cat) => (
                    <div 
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 active:scale-95 flex flex-col items-center text-center
                        ${category === cat.id ? 'border-primary bg-primary text-white shadow-lg' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                    >
                        <div className={`mb-1 ${category === cat.id ? 'text-accent' : 'text-slate-400'}`}>
                            {cat.icon}
                        </div>
                        <span className="text-xs font-bold leading-tight">{cat.label}</span>
                    </div>
                ))}
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium text-slate-700 text-sm" 
                    placeholder="Ex: Condromalácia, Prótese, Dor..."
                />
            </div>
        </section>

        {/* Step 3: Tone & Action */}
        <section className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">3. Personalidade</h2>
            <div className="mb-6 flex flex-wrap gap-2">
                {Object.values(Tone).slice(0, 4).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                        ${tone === t ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200'}`}
                    >
                        {t.split('/')[0]}
                    </button>
                ))}
            </div>
            
            <button 
                type="submit"
                disabled={isGenerating || !topic}
                className={`w-full py-4 bg-primary hover:bg-sidebar-hover text-white rounded-xl font-bold shadow-float transform active:scale-[0.98] transition-all flex items-center justify-center text-lg gap-2 border-b-4 border-black/20
                ${(isGenerating || !topic) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isGenerating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processando IA...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 text-accent" />
                        <span>Gerar Conteúdo</span>
                    </>
                )}
            </button>
        </section>
    </form>
  );
};

export default PostWizard;