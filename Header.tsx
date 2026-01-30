import React from 'react';
import { SOCIETY_EMAIL } from './constants';

const Header: React.FC = () => {
  const handleShare = () => {
    const text = `Salaam! Please use this link to book your Iftar catering slots for Ramadan 2026 at EEIS:\n\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header className="bg-emerald-800 text-white pt-10 pb-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
         <svg width="600" height="600" viewBox="0 0 100 100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1" fill="none" />
         </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div className="text-left mb-6 md:mb-0">
            <h1 className="text-6xl md:text-8xl font-black mb-1 tracking-tighter leading-none">EEIS</h1>
            <p className="text-emerald-100 text-2xl md:text-4xl font-black opacity-95 tracking-tight">Iftar Planner 2026</p>
            <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em] mt-3 border-l-4 border-emerald-400 pl-3">{SOCIETY_EMAIL}</p>
          </div>
          
          <button 
            onClick={handleShare}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-2xl text-[10px] font-black flex items-center justify-center space-x-2 shadow-xl border-b-4 border-green-700 transition-all transform active:translate-y-1 active:border-b-0 self-start md:mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82l.303.18c1.397.83 3.007 1.27 4.654 1.272 5.588 0 10.132-4.544 10.135-10.134.001-2.707-1.051-5.253-2.964-7.168-1.913-1.914-4.459-2.966-7.165-2.966-5.59 0-10.134 4.544-10.137 10.134-.001 1.78.463 3.52 1.34 5.042l.197.339-.994 3.635 3.725-.977zm11.233-7.55c-.29-.145-1.714-.846-1.98-.943-.265-.096-.458-.145-.65.145-.192.29-.745.943-.913 1.136-.168.192-.336.216-.626.071-.29-.145-1.224-.45-2.33-1.438-.86-.767-1.44-1.716-1.61-2.005-.168-.29-.017-.446.128-.59.13-.13.29-.336.434-.506.145-.168.192-.29.29-.482.097-.193.048-.36-.024-.506-.073-.145-.65-1.565-.89-2.144-.233-.566-.47-.489-.65-.498-.168-.008-.36-.01-.553-.01-.193 0-.506.072-.77.36-.265.29-1.011.988-1.011 2.41 0 1.42 1.035 2.794 1.18 2.987.144.193 2.037 3.111 4.935 4.363.689.298 1.227.476 1.646.61.692.219 1.32.188 1.817.114.553-.082 1.714-.7 1.956-1.374.241-.674.241-1.253.168-1.373-.072-.12-.265-.193-.554-.338z"/>
            </svg>
            <span className="tracking-tight uppercase">Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;