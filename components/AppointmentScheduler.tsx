import React, { useState } from 'react';
import { Appointment, AppointmentStatus, AppointmentType, Tone } from '../types';
import { 
    Calendar, 
    Clock, 
    MessageCircle, 
    MoreVertical, 
    CheckCircle2, 
    AlertCircle, 
    Search, 
    Send, 
    X,
    Sparkles,
    User,
    Phone
} from 'lucide-react';
import { generateAppointmentMessage } from '../services/geminiService';

// Mock Data
const initialAppointments: Appointment[] = [
    { id: '1', patientName: 'Ana Clara Souza', date: '2024-10-25', time: '09:00', type: 'first_visit', status: 'confirmed', phone: '5511999999999' },
    { id: '2', patientName: 'Roberto Mendes', date: '2024-10-25', time: '10:30', type: 'post_op', status: 'pending', phone: '5511988888888' },
    { id: '3', patientName: 'Fernanda Oliveira', date: '2024-10-25', time: '14:00', type: 'return', status: 'confirmed', phone: '5511977777777' },
    { id: '4', patientName: 'Carlos Lima', date: '2024-10-26', time: '08:00', type: 'infiltration', status: 'pending', phone: '5511966666666' },
    { id: '5', patientName: 'Mariana Costa', date: '2024-10-26', time: '11:00', type: 'first_visit', status: 'confirmed', phone: '5511955555555' },
];

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<'all' | 'today' | 'pending'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);

  const filteredAppointments = appointments.filter(apt => {
      if (filter === 'pending') return apt.status === 'pending';
      if (filter === 'today') return apt.date === '2024-10-25'; // Mock date check
      return true;
  });

  const getStatusColor = (status: AppointmentStatus) => {
      switch(status) {
          case 'confirmed': return 'bg-green-100 text-green-700';
          case 'pending': return 'bg-yellow-100 text-yellow-700';
          case 'cancelled': return 'bg-red-100 text-red-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const getTypeLabel = (type: AppointmentType) => {
      switch(type) {
          case 'first_visit': return '1ª Vez';
          case 'post_op': return 'Pós-Op';
          case 'return': return 'Retorno';
          case 'infiltration': return 'Infiltração';
          default: return type;
      }
  };

  const handleOpenMessageModal = async (apt: Appointment) => {
      setSelectedAppointment(apt);
      setGeneratedMessage('');
      setCustomNote('');
      // Auto-generate on open
      handleGenerateMessage(apt);
  };

  const handleGenerateMessage = async (apt: Appointment = selectedAppointment!) => {
      setIsGenerating(true);
      try {
          const msg = await generateAppointmentMessage({
              appointment: apt,
              tone: tone,
              customNote: customNote
          });
          setGeneratedMessage(msg);
      } catch (error) {
          console.error(error);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleSendWhatsApp = () => {
      if (!selectedAppointment) return;
      const text = encodeURIComponent(generatedMessage);
      window.open(`https://wa.me/${selectedAppointment.phone}?text=${text}`, '_blank');
      
      // Mark as confirmed if it was pending
      if (selectedAppointment.status === 'pending') {
          setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? { ...a, status: 'confirmed' } : a));
      }
      setSelectedAppointment(null);
  };

  return (
    <div className="bg-white min-h-full lg:rounded-l-3xl shadow-xl overflow-hidden flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-8 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-accent" />
                        Agendamentos
                    </h1>
                    <p className="text-slate-500 text-sm">Gerencie confirmações e dispare lembretes inteligentes.</p>
                </div>
                <div className="bg-slate-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                    ${filter === 'all' ? 'bg-sidebar text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setFilter('today')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                    ${filter === 'today' ? 'bg-sidebar text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
                >
                    Hoje
                </button>
                <button 
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1
                    ${filter === 'pending' ? 'bg-sidebar text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
                >
                    <AlertCircle className="w-3 h-3" /> Pendentes
                </button>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 lg:pb-4">
            {filteredAppointments.map(apt => (
                <div key={apt.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                 <User className="w-5 h-5" />
                             </div>
                             <div>
                                 <h3 className="font-bold text-slate-800 text-sm">{apt.patientName}</h3>
                                 <span className="text-xs text-slate-500 flex items-center gap-1">
                                     <Clock className="w-3 h-3" /> {apt.time} • {getTypeLabel(apt.type)}
                                 </span>
                             </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusColor(apt.status)}`}>
                            {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : apt.status}
                        </span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                        <button 
                            onClick={() => handleOpenMessageModal(apt)}
                            className="flex-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Avisar
                        </button>
                         <button className="w-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg border border-slate-100">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Message Drawer / Modal */}
        {selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] lg:max-h-[800px] animate-slideUp">
                    
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                             <h3 className="font-bold text-lg text-slate-900">Enviar Mensagem</h3>
                             <p className="text-xs text-slate-500">Para: {selectedAppointment.patientName}</p>
                        </div>
                        <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        {/* Config */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Tom da Mensagem</label>
                                <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                                    {Object.values(Tone).slice(0, 3).map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border whitespace-nowrap
                                            ${tone === t ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-500'}`}
                                        >
                                            {t.split('/')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Nota Extra</label>
                                <input 
                                    type="text"
                                    value={customNote}
                                    onChange={(e) => setCustomNote(e.target.value)}
                                    placeholder="Ex: Trazer exames anteriores..."
                                    className="w-full mt-2 p-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <button 
                                onClick={() => handleGenerateMessage()}
                                disabled={isGenerating}
                                className="w-full py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-accent" />
                                {isGenerating ? 'Gerando...' : 'Regerar com IA'}
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 relative">
                            <div className="absolute top-3 right-3 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">Preview</div>
                            <textarea 
                                value={generatedMessage}
                                onChange={(e) => setGeneratedMessage(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-800 leading-relaxed resize-none h-40"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-white lg:rounded-b-3xl">
                        <button 
                            onClick={handleSendWhatsApp}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 text-lg active:scale-[0.98] transition-all"
                        >
                            <Send className="w-5 h-5" />
                            Enviar no WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default AppointmentScheduler;