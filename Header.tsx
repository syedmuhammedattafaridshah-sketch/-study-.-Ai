import React, { useState } from 'react';
import { ViewMode, AdminConfig } from './types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  adminConfig: AdminConfig;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode, adminConfig }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#020617]/90 backdrop-blur-3xl transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Animated Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative">
        <div className="flex items-center gap-8 cursor-pointer group" onClick={() => setViewMode('generator')}>
          {/* Hyper-Intricate AI Logo */}
          <div className="relative w-16 h-16 flex items-center justify-center">
             {/* Outer Glow */}
             <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>
             
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <defs>
                  <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Rotating Outer Rings */}
                <g className="origin-center animate-spin-slow opacity-40">
                  <circle cx="50" cy="50" r="46" stroke="#334155" strokeWidth="0.5" strokeDasharray="10 5" />
                  <circle cx="50" cy="50" r="46" stroke="url(#circuit-grad)" strokeWidth="0.5" strokeDasharray="10 85" strokeLinecap="round" />
                </g>
                <g className="origin-center animate-spin-reverse-slow opacity-60">
                   <circle cx="50" cy="50" r="38" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 10" />
                   <path d="M50 12 L50 20 M50 80 L50 88 M12 50 L20 50 M80 50 L88 50" stroke="#22d3ee" strokeWidth="1" />
                </g>

                {/* Inner Circuit Connections */}
                <g className="opacity-80">
                   <path d="M50 30 L50 42 M30 50 L42 50 M70 50 L58 50" stroke="#22d3ee" strokeWidth="0.5" />
                   <circle cx="50" cy="30" r="1.5" fill="#22d3ee" />
                   <circle cx="30" cy="50" r="1.5" fill="#22d3ee" />
                   <circle cx="70" cy="50" r="1.5" fill="#22d3ee" />
                </g>

                {/* Central Processor */}
                <g className="origin-center animate-pulse-fast" filter="url(#glow)">
                   <path d="M50 42 L57 46 L57 54 L50 58 L43 54 L43 46 Z" fill="rgba(34, 211, 238, 0.1)" stroke="url(#circuit-grad)" strokeWidth="1" />
                   <circle cx="50" cy="50" r="3" fill="#22d3ee" />
                </g>
                
                {/* Data Flow Particles */}
                <circle cx="50" cy="50" r="25" stroke="none" fill="none">
                   <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="3s" repeatCount="indefinite" />
                   <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                   <circle cx="50" cy="25" r="1" fill="#fff" />
                </circle>
             </svg>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-3xl font-tech font-bold text-white tracking-widest flex items-center gap-2 drop-shadow-lg select-none">
              STUDY<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 animate-text-shimmer bg-[length:200%_auto]">.AI</span>
            </h1>
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
               <span className="text-[9px] text-slate-400 font-mono tracking-[0.3em] uppercase opacity-80 group-hover:text-cyan-400 transition-colors">
                 {viewMode === 'chat' ? 'Neural Link V2' : viewMode === 'about' ? 'Identity Matrix' : viewMode === 'admin' ? 'Root Access' : 'System Online'}
               </span>
            </div>
          </div>
        </div>
        
        {/* Profile & Navigation */}
        <div className="relative">
            <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-4 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-cyan-500/30 transition-all group backdrop-blur-md"
            >
                <span className="text-xs font-mono text-cyan-400 hidden md:block tracking-wider uppercase">{adminConfig.ownerName.split(' ')[0]}</span>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500/30 group-hover:border-cyan-500/80 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                    <img src={adminConfig.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
            </button>

            {showProfileMenu && (
                <div className="absolute right-0 top-14 w-60 bg-[#0f172a]/95 border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in-up z-50 backdrop-blur-xl">
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 to-transparent">
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1">Authenticated As</p>
                        <p className="text-sm text-white font-bold truncate">{adminConfig.ownerName}</p>
                    </div>
                    <div className="p-2 space-y-1">
                        <button 
                            onClick={() => { setViewMode('generator'); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wide text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                            <span>// Generator</span>
                        </button>
                        <button 
                            onClick={() => { setViewMode('about'); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wide text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                           <span>// About Us</span>
                        </button>
                        <div className="h-px bg-white/10 my-1 mx-2"></div>
                        <button 
                            onClick={() => { setViewMode('admin'); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wide text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors flex items-center gap-3"
                        >
                            <span>// Admin Console</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      {showProfileMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
      )}
    </header>
  );
};