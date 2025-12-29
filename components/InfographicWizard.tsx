import React, { useState } from 'react';
import { InfographicState, PatientProfile, Tone } from '../types';
import { Sparkles, Stethoscope, UserCircle, MessageSquare, StickyNote } from 'lucide-react';

interface InfographicWizardProps {
  onGenerate: (state: InfographicState) => void;
  isGenerating: boolean;
}

const InfographicWizard: React.FC<InfographicWizardProps> = ({ onGenerate, isGenerating }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(PatientProfile.ADULT);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ diagnosis, patientProfile, tone, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                Gerador Clínico
            </h2>
            <p className="text-slate-500 mt-2">Crie infográficos de alto padrão para seus pacientes. Insira o diagnóstico abaixo.</p>
        </div>

        <div className="space-y-6">
            {/* Diagnosis Input */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> Diagnóstico / Procedimento
                </label>
                <input 
                    type="text" 
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Ex: Pós-operatório LCA, Tendinite Patelar..."
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500 border border-slate-800"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Profile */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                        <UserCircle className="w-4 h-4" /> Perfil do Paciente
                    </label>
                    <div className="relative">
                        <select
                            value={patientProfile}
                            onChange={(e) => setPatientProfile(e.target.value as PatientProfile)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700 cursor-pointer"
                        >
                            {Object.values(PatientProfile).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tone */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Tom da Comunicação
                    </label>
                    <div className="relative">
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value as Tone)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700 cursor-pointer"
                        >
                            {Object.values(Tone).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                    <StickyNote className="w-4 h-4" /> Notas Clínicas Adicionais (Opcional)
                </label>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Digite aqui instruções específicas para a IA (ex: 'Focar em exercícios isométricos' ou 'Evitar mencionar uso de tipoia')."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-slate-700"
                />
            </div>
        </div>

        <div className="mt-8">
            <button 
                type="submit"
                disabled={isGenerating || !diagnosis}
                className={`w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-lg transform active:scale-[0.99] transition-all flex items-center justify-center text-lg
                ${(isGenerating || !diagnosis) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isGenerating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Gerando...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Infográfico
                    </>
                )}
            </button>
        </div>
    </form>
  );
};

export default InfographicWizard;