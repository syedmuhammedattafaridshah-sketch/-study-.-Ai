import React, { useState } from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Study AI",
      desc: "Your intelligent neural interface for instant assessment generation. This brief tour will guide you through the protocol.",
      targetId: null,
    },
    {
      title: "Input Source",
      desc: "Upload documents (PDF, Docx) or enter raw text/prompts in the 'Data Portal'. This is the knowledge base for the AI.",
      targetId: "upload-section",
    },
    {
      title: "Configuration Deck",
      desc: "Customize the test parameters. Adjust difficulty, specific question counts, and define the topic focus.",
      targetId: "config-panel",
    },
    {
      title: "Engage Neural Engine",
      desc: "Click 'Generate Test' to start the Study AI neural processing. Once complete, you can preview and download a secure PDF.",
      targetId: "generate-btn",
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[70] bg-[#020617]/80 backdrop-blur-md transition-all duration-500 animate-fade-in-up flex items-center justify-center">
      <div className="bg-[#0f172a] border border-cyan-500/40 p-10 rounded-2xl max-w-lg w-full shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden group">
        
        {/* Animated Border Gradient */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 animate-shimmer"></div>
        <div className="absolute inset-0 bg-circuit opacity-10 pointer-events-none"></div>

        <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-tech font-bold text-white tracking-wide">{currentStep.title}</h3>
               <div className="flex items-center gap-2">
                   {[...Array(steps.length)].map((_, i) => (
                       <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-gray-700'}`}></div>
                   ))}
               </div>
            </div>
            
            <p className="text-gray-300 mb-10 leading-relaxed font-sans text-lg border-l-4 border-gray-700 pl-6 py-2">{currentStep.desc}</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
               <button onClick={onClose} className="text-gray-500 text-sm hover:text-white px-4 py-2 font-mono uppercase transition-colors tracking-widest hover:underline decoration-cyan-500 underline-offset-4">Skip Tour</button>
               <button 
                 onClick={handleNext} 
                 className="bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg font-mono uppercase tracking-wider flex items-center gap-3 hover:shadow-cyan-500/30 hover:-translate-y-1"
               >
                 <span>{step === steps.length - 1 ? 'Initialize System' : 'Next Step'}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                 </svg>
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};