import React, { useState } from 'react';
import { GeneratedInfographic } from '../types';
import { 
    Download, 
    Link, 
    Check, 
    ChevronDown, 
    Timer, 
    Activity, 
    AlertCircle, 
    ArrowRight,
    MapPin,
    ArrowLeft
} from 'lucide-react';

interface InfographicPreviewProps {
  data: GeneratedInfographic;
  heroImageUrl?: string;
  anatomyImageUrl?: string;
  onBack?: () => void;
}

const InfographicPreview: React.FC<InfographicPreviewProps> = ({ data, heroImageUrl, anatomyImageUrl, onBack }) => {
  const [activeTreatment, setActiveTreatment] = useState<'conservador' | 'cirurgico'>('cirurgico');
  const [activeAnatomyPoint, setActiveAnatomyPoint] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const treatmentOptions = {
    conservador: data.treatment?.options?.find(o => o.type === 'conservador'),
    cirurgico: data.treatment?.options?.find(o => o.type === 'cirurgico')
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 overflow-hidden relative animate-fadeIn">
        
        {/* Helper Styles for Print */}
        <style>{`
            @media print {
                @page { margin: 0; size: auto; }
                body { background: white; }
                body * { visibility: hidden; }
                #infographic-print-area, #infographic-print-area * { visibility: visible; }
                #infographic-print-area { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    width: 100%; 
                    margin: 0;
                    padding: 0;
                    background: white;
                    overflow: visible;
                }
                .no-print { display: none !important; }
            }
        `}</style>

        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20 shadow-sm no-print sticky top-0">
            <div className="flex items-center gap-4">
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Edição
                    </button>
                )}
                <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                <h3 className="font-bold text-slate-700 hidden md:block">Preview: {data.topic}</h3>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Link Copiado' : 'Compartilhar Link'}</span>
                </button>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-lg"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Baixar PDF</span>
                </button>
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth bg-slate-50 w-full" id="infographic-print-area">
            
            {/* HERO SECTION */}
            <header className="relative w-full min-h-[500px] flex flex-col justify-end pb-12 overflow-hidden bg-slate-900 text-white">
                {heroImageUrl ? (
                    <img src={heroImageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="absolute inset-0 bg-slate-800 opacity-60 flex items-center justify-center text-slate-600 font-bold text-2xl">Gerando Imagem...</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                
                <div className="relative container mx-auto px-8 z-10 max-w-5xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-600/80 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/30">
                        Guia Visual Completo
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        {data.heroTitle}
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
                        {data.heroSubtitle}
                    </p>
                    <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm animate-bounce no-print">
                        Role para explorar <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </header>

            {/* ANATOMY SECTION */}
            {data.anatomy && (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-8 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">Anatomia Explicada</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">{data.anatomy.intro}</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        {/* Interactive Image */}
                        <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
                             {anatomyImageUrl ? (
                                <img src={anatomyImageUrl} alt="Anatomia" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">Gerando Anatomia...</div>
                            )}
                            
                            {/* Hotspots */}
                            {data.anatomy.points?.map((point, idx) => (
                                <button 
                                    key={idx}
                                    className="absolute w-8 h-8 -ml-4 -mt-4 cursor-pointer z-10 hover:z-20 group/hotspot focus:outline-none"
                                    style={{ top: `${point.y}%`, left: `${point.x}%` }}
                                    onClick={() => setActiveAnatomyPoint(idx)}
                                >
                                    <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
                                    <span className={`absolute inset-0 rounded-full border-2 border-white shadow-sm transition-colors duration-300 flex items-center justify-center text-xs font-bold text-white
                                        ${activeAnatomyPoint === idx ? 'bg-blue-600 scale-110' : 'bg-blue-500'}`}>
                                        {idx + 1}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Info Panel */}
                        <div className="flex-1 w-full bg-slate-50 p-8 rounded-2xl border border-slate-200 min-h-[250px] flex flex-col justify-center transition-all duration-300">
                             {activeAnatomyPoint !== null && data.anatomy.points && data.anatomy.points[activeAnatomyPoint] ? (
                                <div className="animate-fadeIn">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">{data.anatomy.points[activeAnatomyPoint].label}</h3>
                                            <p className="text-slate-600 leading-relaxed">{data.anatomy.points[activeAnatomyPoint].text}</p>
                                        </div>
                                    </div>
                                </div>
                             ) : (
                                <div className="text-center text-slate-400">
                                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Clique nos pontos numerados da imagem para ver os detalhes anatômicos.</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* MECHANISM SECTION */}
            {data.mechanism && (
            <section className="py-16 bg-slate-900 text-white">
                <div className="container mx-auto px-8 max-w-5xl">
                    <h2 className="text-3xl font-bold mb-8 text-blue-400">{data.mechanism.title}</h2>
                    <p className="text-lg text-slate-300 mb-12 max-w-3xl">{data.mechanism.intro}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.mechanism.steps?.map((step, idx) => (
                            <div key={idx} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                                <div className="text-4xl font-black text-slate-700 mb-4 opacity-50">0{idx + 1}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

             {/* SYMPTOMS SECTION */}
             {data.symptoms && (
             <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-8 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Sinais e Sintomas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.symptoms.items?.map((symptom, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-blue-500">
                                <h3 className="font-bold text-lg mb-2 text-slate-800">{symptom.title}</h3>
                                <p className="text-sm text-slate-600">{symptom.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* TREATMENT SECTION */}
            {data.treatment && (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-8 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">Opções de Tratamento</h2>
                    
                    {/* Toggle */}
                    <div className="bg-slate-100 p-1 rounded-full flex mb-8 max-w-md mx-auto relative no-print">
                        <div 
                            className="absolute top-1 bottom-1 w-[49%] bg-white rounded-full shadow-sm transition-all duration-300"
                            style={{ left: activeTreatment === 'conservador' ? '0.5%' : '50.5%' }}
                        ></div>
                        <button 
                            onClick={() => setActiveTreatment('conservador')} 
                            className={`flex-1 py-2 text-center relative z-10 font-bold text-sm transition-colors ${activeTreatment === 'conservador' ? 'text-blue-600' : 'text-slate-500'}`}
                        >
                            Conservador
                        </button>
                        <button 
                            onClick={() => setActiveTreatment('cirurgico')} 
                            className={`flex-1 py-2 text-center relative z-10 font-bold text-sm transition-colors ${activeTreatment === 'cirurgico' ? 'text-blue-600' : 'text-slate-500'}`}
                        >
                            Cirúrgico
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        {treatmentOptions[activeTreatment] && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-blue-600 mb-4">{treatmentOptions[activeTreatment]?.title}</h3>
                                <p className="text-slate-600 mb-6 text-lg">{treatmentOptions[activeTreatment]?.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Prós</h4>
                                        <ul className="space-y-2">
                                            {treatmentOptions[activeTreatment]?.pros?.map((pro, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" /> Contras</h4>
                                        <ul className="space-y-2">
                                            {treatmentOptions[activeTreatment]?.cons?.map((con, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <span className="font-bold text-blue-800 text-xs uppercase tracking-wider">Indicação Principal:</span>
                                        <p className="text-sm text-slate-700 mt-1 font-medium">{treatmentOptions[activeTreatment]?.indication}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            )}

            {/* REHAB SECTION */}
            {data.rehab && (
            <section className="py-16 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold">Jornada de Recuperação</h2>
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            <span>Tempo estimado variável</span>
                        </div>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x scroll-smooth no-scrollbar">
                        {data.rehab.phases?.map((phase, idx) => (
                            <div key={idx} className="min-w-[300px] md:min-w-[350px] bg-slate-800 rounded-2xl p-6 border border-slate-700 snap-center relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl select-none">
                                    {idx + 1}
                                </div>
                                <h3 className="text-blue-400 font-bold uppercase text-xs tracking-wider mb-2">{phase.phase}</h3>
                                <h4 className="text-xl font-bold mb-4">{phase.title}</h4>
                                <ul className="space-y-3 text-slate-300">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* FOOTER */}
            <footer className="bg-slate-950 text-slate-500 py-12 text-center text-sm">
                <p className="max-w-2xl mx-auto px-6">{data.footerText}</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-50">
                    <Activity className="w-3 h-3" /> Gerado por MediSocial AI
                </div>
            </footer>
        </div>
    </div>
  );
};

export default InfographicPreview;