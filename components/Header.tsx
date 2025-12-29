import React from 'react';
import { ChevronLeft, User, Menu } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ onBack, showBack, title, subtitle }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm z-50 relative">
      <div className="flex items-center gap-6">
        {showBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-bold uppercase tracking-wide shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Início
          </button>
        )}
        
        <div className="flex items-center gap-4">
            {!showBack && (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                        MS
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 leading-none tracking-tighter">MEDISOCIAL</h1>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Intranet Médica</p>
                    </div>
                </div>
            )}
            
            {showBack && (
                <div className="border-l border-slate-300 pl-6 ml-2">
                    <h2 className="text-lg font-bold text-slate-800 uppercase leading-tight">{title}</h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{subtitle}</p>
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">DR. SILVA</p>
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Cirurgião Ortopedista</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
            <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};

export default Header;