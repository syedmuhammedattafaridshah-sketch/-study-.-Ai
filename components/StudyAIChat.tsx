
import React, { useState, useRef, useEffect } from 'react';
import { chatWithStudyAI } from '../services/geminiService';
import { ChatMessage } from '../types';

interface StudyAIChatProps {
  onClose: () => void;
}

// Helper to handle bold, italics inside non-code blocks
const parseInlineFormatting = (text: string) => {
    // Handle bold: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-cyan-400 font-bold text-shadow-sm">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

// Main formatter handling code blocks vs regular text
const formatMessageContent = (text: string) => {
  if (!text) return null;

  // Split by code blocks (```language ... ```)
  const parts = text.split(/```([\s\S]*?)```/g);

  return parts.map((part, index) => {
    // If odd index, it's a code block (based on split logic)
    if (index % 2 === 1) {
       // Attempt to extract language if present (e.g., "javascript\n...")
       const lines = part.trim().split('\n');
       const firstLine = lines[0].trim();
       let codeContent = part.trim();
       let languageLabel = "CODE";
       
       // Simple check if first line looks like a language identifier
       if (firstLine && !firstLine.includes(' ') && lines.length > 1) {
           languageLabel = firstLine.toUpperCase();
           codeContent = lines.slice(1).join('\n');
       }

       return (
         <div key={index} className="my-4 rounded-lg overflow-hidden border border-white/10 bg-[#020617] shadow-lg">
             <div className="bg-white/5 px-4 py-1.5 flex justify-between items-center border-b border-white/5">
                 <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{languageLabel}</span>
                 <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                 </div>
             </div>
             <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-cyan-100/90 custom-scrollbar">
                 <code>{codeContent}</code>
             </pre>
         </div>
       );
    }

    // Regular text formatting (bullets, headings, paragraphs)
    const lines = part.split('\n');
    return (
        <div key={index}>
            {lines.map((line, i) => {
                if (line.trim().startsWith('* ')) {
                    const content = line.trim().substring(2);
                    return (
                        <li key={`${index}-${i}`} className="mb-1 pl-4 relative text-gray-300">
                            {parseInlineFormatting(content)}
                        </li>
                    );
                }
                if (line.trim().startsWith('### ')) {
                    return <h4 key={`${index}-${i}`} className="text-purple-300 font-bold mt-3 mb-1 font-tech tracking-wide">{parseInlineFormatting(line.trim().substring(4))}</h4>
                }
                if (line.trim() === '') {
                    return <div key={`${index}-${i}`} className="h-2"></div>;
                }
                return (
                    <p key={`${index}-${i}`} className="mb-1 leading-relaxed">
                        {parseInlineFormatting(line)}
                    </p>
                );
            })}
        </div>
    );
  });
};

export const StudyAIChat: React.FC<StudyAIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. I am Study.AI, your advanced academic assistant. I can help explain concepts, draft study plans, or answer questions about your documents. How may I assist you?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithStudyAI(messages, input);
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { role: 'model', text: "Connection Interrupt. Neural pathway blocked. Please try again.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col relative overflow-hidden rounded-3xl border border-white/10 bg-[#050b1d]/90 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-fade-in-up ring-1 ring-cyan-500/20">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-circuit opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.5)]"></div>

        {/* Chat Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/40 backdrop-blur-md z-20">
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] group">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-slow"></div>
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke="currentColor"/>
                    </svg>
                </div>
                <div>
                   <h2 className="text-white font-tech font-bold tracking-wider text-lg">STUDY.AI <span className="text-cyan-400 text-[10px] ml-2 font-mono bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">V2.5 BETA</span></h2>
                   <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                      <p className={`text-[10px] font-mono tracking-widest uppercase ${loading ? 'text-amber-400' : 'text-emerald-400/80'}`}>
                          {loading ? 'Processing Input' : 'Neural Interface Active'}
                      </p>
                   </div>
                </div>
            </div>
            
            <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10 scroll-smooth">
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
               {msg.role === 'model' && (
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex-shrink-0 mr-4 mt-1 flex items-center justify-center shadow-lg border border-cyan-500/20">
                     <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-cyan-400">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor"/>
                     </svg>
                 </div>
               )}
               
               <div className={`
                  max-w-[90%] md:max-w-[80%] p-6 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300
                  ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30 text-cyan-50 rounded-tr-sm hover:border-cyan-400/50' 
                    : 'bg-[#0f172a]/90 border-white/5 text-gray-300 rounded-tl-sm hover:bg-[#1e293b]/90 hover:border-white/10 ai-response'}
               `}>
                 <div className="leading-7 font-light tracking-wide text-sm md:text-base">
                    {msg.role === 'user' ? msg.text : <div>{formatMessageContent(msg.text)}</div>}
                 </div>
                 <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono opacity-40 uppercase tracking-widest flex justify-end gap-2">
                    {msg.role === 'model' && <span>Study.AI Node</span>}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 </div>
               </div>
               
               {msg.role === 'user' && (
                   <div className="w-8 h-8 rounded-full bg-cyan-950/30 flex-shrink-0 ml-4 mt-1 flex items-center justify-center border border-cyan-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-cyan-600">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                   </div>
               )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
             <div className="flex justify-start w-full animate-fade-in-up">
               <div className="w-8 h-8 rounded-full bg-[#0f172a] flex-shrink-0 mr-4 mt-1 flex items-center justify-center shadow-lg border border-cyan-500/20">
                   <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-cyan-400 animate-spin-slow">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor"/>
                     </svg>
               </div>
               <div className="bg-[#0f172a]/60 border border-cyan-500/20 px-6 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
                  <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase">Thinking...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-black/40 border-t border-white/5 relative z-20 backdrop-blur-xl">
           <div className="relative group max-w-4xl mx-auto">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-50 transition duration-500 blur-sm"></div>
             <div className="relative flex items-center bg-[#020617] rounded-xl border border-white/10 shadow-2xl">
                 <div className="pl-4 text-cyan-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                 </div>
                 <input 
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={handleKeyPress}
                   placeholder="Ask Study.AI anything (e.g., 'Summarize chapter 3', 'Generate code for...')"
                   className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 px-4 py-4 font-sans text-sm tracking-wide"
                   disabled={loading}
                   autoFocus
                 />
                 <button 
                   onClick={handleSend}
                   disabled={loading || !input.trim()}
                   className="mr-2 p-2 rounded-lg bg-gray-900 text-cyan-500 border border-cyan-500/10 hover:bg-cyan-900/30 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-30 disabled:hover:bg-gray-900 transition-all duration-300"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                 </button>
             </div>
           </div>
           <p className="text-center text-[10px] text-gray-500 font-mono mt-3 uppercase tracking-widest opacity-60">
              Study.AI V2.5 • Neural Response Engine Active
           </p>
        </div>
    </div>
  );
};
