import React from 'react';
import { 
  PlusCircle, 
  AlignLeft, 
  PieChart, 
  FolderOpen, 
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  
  const tools = [
    {
      id: 'appointments', // New ID
      title: 'Agendamentos',
      description: 'Lembretes automáticos e gestão de pacientes via IA.',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-50',
      hover: 'hover:border-green-200'
    },
    {
      id: 'post',
      title: 'Post Instagram',
      description: 'Crie conteúdo de alta conversão para redes sociais focado em patologias.',
      icon: PlusCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      hover: 'hover:border-orange-200'
    },
    {
      id: 'conversion',
      title: 'Conversão Cirúrgica',
      description: 'Roteiros de Reels e Artigos profundos para quebrar objeções de Artrose e Joelho.',
      icon: TrendingUp,
      color: 'text-red-600',
      bg: 'bg-red-50',
      hover: 'hover:border-red-200'
    },
    {
      id: 'infographic',
      title: 'Infográfico Clínico',
      description: 'Transforme diagnósticos complexos em visuais interativos e didáticos.',
      icon: PieChart,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      hover: 'hover:border-blue-200'
    },
    {
      id: 'seo',
      title: 'Artigo SEO',
      description: 'Redação completa de artigos médicos otimizados para buscas no Google.',
      icon: AlignLeft,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      hover: 'hover:border-purple-200'
    },
    {
      id: 'materials',
      title: 'Materiais Educativos',
      description: 'Biblioteca de PDFs e vídeos para enviar aos pacientes no pós-consulta.',
      icon: FolderOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hover: 'hover:border-emerald-200'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-fadeIn">
      <div className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Painel de Ferramentas</h1>
        <p className="text-slate-500 text-sm md:text-lg">Selecione a ferramenta que deseja utilizar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8 pb-10">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-transparent cursor-pointer transition-all duration-300 active:scale-95 md:hover:scale-100 md:hover:shadow-xl md:hover:-translate-y-1 flex flex-col items-center text-center group ${tool.hover}`}
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${tool.bg} flex items-center justify-center mb-4 md:mb-6 transition-transform group-hover:scale-110 duration-300`}>
              <tool.icon className={`w-8 h-8 md:w-10 md:h-10 ${tool.color}`} />
            </div>
            
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3 uppercase tracking-tight">{tool.title}</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 flex-grow max-w-xs">
              {tool.description}
            </p>

            <div className="mt-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                Acessar <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;