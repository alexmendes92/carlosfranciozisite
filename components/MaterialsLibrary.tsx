import React from 'react';
import { Share2, FileText, Video, Image as ImageIcon, UploadCloud } from 'lucide-react';

const materials = [
  { 
    id: 1, 
    title: "Guia Pós-Op LCA", 
    type: "PDF", 
    icon: FileText, 
    img: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 2, 
    title: "Exercícios em Casa", 
    type: "Vídeo", 
    icon: Video, 
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 3, 
    title: "Anatomia do Joelho", 
    type: "Infográfico", 
    icon: ImageIcon, 
    img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 4, 
    title: "Prevenção de Lesões", 
    type: "PDF", 
    icon: FileText, 
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 5, 
    title: "Cuidados com Gesso", 
    type: "PDF", 
    icon: FileText, 
    img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 6, 
    title: "Nutrição e Ossos", 
    type: "Vídeo", 
    icon: Video, 
    img: "https://images.unsplash.com/photo-1598449356475-b9f71db7d847?auto=format&fit=crop&w=800&q=80" 
  },
];

const MaterialsLibrary = () => {
  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Materiais Educativos</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-lg">Biblioteca de conteúdos para enviar aos pacientes.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {materials.map((item) => (
          <div key={item.id} className="bg-white p-2 md:p-3 rounded-xl shadow-card border border-app-border group cursor-pointer relative hover:-translate-y-1 transition-transform duration-200">
            <div className="aspect-[3/4] bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
               <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                  <item.icon className="w-3 h-3" />
                  {item.type}
               </div>
            </div>
            <h3 className="font-bold text-slate-800 text-xs md:text-sm truncate">{item.title}</h3>
            <button className="mt-2 w-full py-2 text-xs font-medium text-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 active:bg-blue-200">
                <Share2 className="w-3.5 h-3.5" /> <span className="hidden md:inline">Compartilhar</span>
            </button>
          </div>
        ))}

        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-primary hover:text-primary transition-colors cursor-pointer aspect-[3/4] hover:bg-blue-50/30 active:scale-95">
            <UploadCloud className="w-8 h-8 md:w-10 md:h-10 mb-2" />
            <span className="text-xs font-medium text-center">Upload Novo</span>
        </div>
      </div>
    </div>
  );
};

export default MaterialsLibrary;