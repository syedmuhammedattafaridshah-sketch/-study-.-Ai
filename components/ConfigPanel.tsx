import React from 'react';
import { Difficulty, QuestionConfig } from '../types';

interface ConfigPanelProps {
  config: QuestionConfig;
  setConfig: React.Dispatch<React.SetStateAction<QuestionConfig>>;
  disabled: boolean;
}

interface InputControlProps {
  label: string;
  value: number;
  max: number;
  onChange: (val: number) => void;
  disabled: boolean;
}

// Extracted to prevent re-renders losing focus
const InputControl: React.FC<InputControlProps> = ({ label, value, max, onChange, disabled }) => (
  <div className="group relative bg-[#0f172a]/40 hover:bg-[#1e293b]/60 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all duration-500 backdrop-blur-md overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]">
    {/* Subtle Moving Background */}
    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.05)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer pointer-events-none"></div>
    
    <div className="relative z-10 flex justify-between items-center mb-4">
      <label className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-cyan-300 uppercase tracking-widest transition-colors duration-300 flex items-center gap-2">
         <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-500 transition-colors shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
         {label}
      </label>
      <span className="text-[9px] font-mono text-slate-600 group-hover:text-cyan-400/80 transition-colors border border-white/5 px-2 py-0.5 rounded bg-black/20">MAX: {max}</span>
    </div>
    
    <div className="relative z-10 flex items-end gap-5">
      <div className="flex-1 relative h-10 flex items-center group/slider">
         {/* Track */}
         <div className="absolute w-full h-1 bg-slate-800 rounded-full overflow-hidden shadow-inner group-hover/slider:bg-slate-700 transition-colors">
             <div 
               className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] relative overflow-hidden"
               style={{ width: `${(value / max) * 100}%` }}
             >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
             </div>
         </div>
         
         <input 
          type="range" 
          min="0" 
          max={max} 
          value={value} 
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Thumb */}
        <div 
          className="absolute h-4 w-4 bg-[#0f172a] rounded-full shadow-[0_0_0_2px_#22d3ee] pointer-events-none transition-all duration-200 group-active/slider:scale-125 group-active/slider:shadow-[0_0_0_4px_rgba(34,211,238,0.3)]"
          style={{ left: `calc(${((value / max) * 100)}% - 8px)` }}
        ></div>
      </div>
      
      <div className="relative group/input">
          <input
            type="number"
            min="0"
            max={max}
            value={value.toString()}
            disabled={disabled}
            onChange={(e) => {
               let val = parseInt(e.target.value);
               if (isNaN(val)) val = 0;
               if (val > max) val = max;
               if (val < 0) val = 0;
               onChange(val);
            }}
            className="w-14 bg-black/30 border border-white/10 text-cyan-300 font-mono text-base font-bold text-center rounded focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-none py-1.5 transition-all shadow-inner hover:bg-black/50"
          />
      </div>
    </div>
  </div>
);

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, disabled }) => {
  
  const handleChange = (key: keyof QuestionConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div id="config-panel" className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden flex flex-col shadow-2xl transition-all duration-500 border border-white/10 hover:border-cyan-500/20 backdrop-blur-2xl">
      {/* Holographic Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
      
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6 relative z-10">
        <div>
          <h2 className="text-xl font-tech font-bold text-white tracking-widest flex items-center gap-3 text-glow">
            <div className="w-8 h-8 rounded-lg bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
            </div>
            CONFIGURATION
          </h2>
          <p className="text-[10px] font-mono text-slate-500 mt-2 pl-11 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
            Parameters Deck
          </p>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 relative z-10">
        
        {/* Header/Watermark Config Section */}
        <div className="grid grid-cols-1 gap-6 bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="group relative">
              <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest pl-1 group-focus-within:text-cyan-400 transition-colors">
                Exam Name (Header)
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={disabled}
                  value={config.examName || ''}
                  onChange={(e) => handleChange('examName', e.target.value)}
                  placeholder="e.g., FINAL TERM EXAMINATION 2024"
                  className="w-full px-5 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-[#0f172a] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all font-sans text-sm tracking-wide"
                />
              </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                   <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest pl-1 group-focus-within:text-purple-400 transition-colors">
                      Watermark Text
                   </label>
                   <input
                      type="text"
                      disabled={disabled}
                      value={config.watermarkText || ''}
                      onChange={(e) => handleChange('watermarkText', e.target.value)}
                      placeholder="e.g. CONFIDENTIAL"
                      className="w-full px-5 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-[#0f172a] focus:border-purple-500/50 focus:outline-none transition-all font-sans text-sm tracking-wide"
                   />
                </div>
                 <div className="group">
                   <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest pl-1 group-hover:text-pink-400 transition-colors">
                      Opacity ({Math.round((config.watermarkOpacity || 0.1) * 100)}%)
                   </label>
                   <div className="flex items-center h-[46px] px-2 bg-[#0f172a]/30 rounded-xl border border-white/5">
                       <input
                          type="range"
                          min="0.05"
                          max="0.5"
                          step="0.05"
                          disabled={disabled}
                          value={config.watermarkOpacity || 0.1}
                          onChange={(e) => handleChange('watermarkOpacity', parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400"
                       />
                   </div>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest pl-1 group-focus-within:text-cyan-400 transition-colors">
                    Topic / Focus Area
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    value={config.topicFocus}
                    onChange={(e) => handleChange('topicFocus', e.target.value)}
                    placeholder="e.g., Quantum Mechanics"
                    className="w-full px-5 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-[#0f172a] focus:border-cyan-500/50 focus:outline-none transition-all font-sans text-sm tracking-wide"
                  />
                </div>
                <div className="group relative">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest pl-1 group-focus-within:text-pink-400 transition-colors">
                    Subtitle / Date
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    value={config.pdfSubtitle || ''}
                    onChange={(e) => handleChange('pdfSubtitle', e.target.value)}
                    placeholder="e.g. October 12, 2024"
                    className="w-full px-5 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-[#0f172a] focus:border-pink-500/50 focus:outline-none transition-all font-sans text-sm tracking-wide"
                  />
                </div>
            </div>
        </div>

        {/* Quantities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <InputControl label="Multiple Choice" value={config.mcqCount} max={50} onChange={(v) => handleChange('mcqCount', v)} disabled={disabled} />
          <InputControl label="Short Answer" value={config.shortQCount} max={20} onChange={(v) => handleChange('shortQCount', v)} disabled={disabled} />
          <InputControl label="Long Answer" value={config.longQCount || 0} max={10} onChange={(v) => handleChange('longQCount', v)} disabled={disabled} />
          <InputControl label="True / False" value={config.tfCount} max={50} onChange={(v) => handleChange('tfCount', v)} disabled={disabled} />
          <InputControl label="Fill Blanks" value={config.blankCount} max={50} onChange={(v) => handleChange('blankCount', v)} disabled={disabled} />
          <InputControl label="Essay Questions" value={config.essayCount || 0} max={5} onChange={(v) => handleChange('essayCount', v)} disabled={disabled} />
          <InputControl label="Matching Pairs" value={config.matchCount || 0} max={15} onChange={(v) => handleChange('matchCount', v)} disabled={disabled} />
        </div>

        {/* Difficulty Matrix */}
        <div className="pt-6 border-t border-white/5">
           <label className="block text-[10px] font-mono font-bold text-slate-500 mb-4 uppercase tracking-widest pl-1">Cognitive Load (Difficulty)</label>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.values(Difficulty).map((level) => (
                <button
                  key={level}
                  disabled={disabled}
                  onClick={() => handleChange('difficulty', level)}
                  className={`
                    relative py-3 px-1 rounded-xl text-[9px] md:text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border overflow-hidden group
                    ${config.difficulty === level 
                      ? level === 'Important' 
                        ? 'bg-amber-900/30 border-amber-500/50 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'bg-cyan-900/30 border-cyan-500/50 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                      : 'bg-[#0f172a]/40 text-slate-500 border-white/5 hover:border-white/20 hover:text-slate-300'}
                  `}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${level==='Important' ? 'bg-amber-500/10' : 'bg-cyan-500/10'}`}></div>
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {level === 'Important' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-400 animate-pulse">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    )}
                    {level}
                  </span>
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};