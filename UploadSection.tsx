import React, { useState, useRef } from 'react';
import { FileData } from './types';

interface UploadSectionProps {
  file: FileData | null;
  setFile: (f: FileData | null) => void;
  textContext: string;
  setTextContext: (t: string) => void;
  disabled: boolean;
}

declare global {
  interface Window {
    mammoth: any;
  }
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  file, setFile, textContext, setTextContext, disabled 
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [processing, setProcessing] = useState(false);
  const [unsupportedError, setUnsupportedError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileName = selectedFile.name.toLowerCase();
      const fileType = selectedFile.type;
      
      setProcessing(true);
      setUnsupportedError(null);

      try {
        // DOCX handling
        if (fileName.endsWith('.docx')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
              .then((result: any) => {
                setTextContext(result.value);
                setFile(null);
                setActiveTab('text');
                setProcessing(false);
              })
              .catch((err: any) => {
                console.error(err);
                setUnsupportedError("Could not extract text from this Word document.");
                setProcessing(false);
              });
          };
          reader.readAsArrayBuffer(selectedFile);
          return;
        }

        // PDF & Image handling
        if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64String = (event.target?.result as string).split(',')[1];
            setFile({
              name: selectedFile.name,
              mimeType: selectedFile.type,
              data: base64String
            });
            setTextContext('');
            setProcessing(false);
          };
          reader.readAsDataURL(selectedFile);
          return;
        }

        // Text handling
        const isText = fileType.startsWith('text/') || 
                       fileName.match(/\.(txt|md|csv|json|js|jsx|ts|tsx|py|html|css|xml|log|sql|ini|yaml|yml)$/);
        
        if (isText) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setTextContext(event.target?.result as string);
            setFile(null);
            setActiveTab('text');
            setProcessing(false);
          };
          reader.readAsText(selectedFile);
          return;
        }

        // Unsupported Binary
        if (fileName.match(/\.(pptx|ppt|xlsx|xls|odt)$/)) {
            setUnsupportedError(`The format .${fileName.split('.').pop()?.toUpperCase()} requires conversion to PDF before upload.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setProcessing(false);
            return;
        }

        setUnsupportedError(`The format .${fileName.split('.').pop()} is not supported.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setProcessing(false);

      } catch (error) {
        console.error("File processing error:", error);
        setUnsupportedError("System error during file ingestion.");
        setProcessing(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden shadow-2xl transition-all hover:shadow-[0_0_40px_rgba(56,189,248,0.1)]">
        
        {/* Error Modal */}
        {unsupportedError && (
            <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in-up">
                <div className="bg-red-950/30 border border-red-500/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <h3 className="text-red-400 font-tech text-xl mb-3">INGESTION ERROR</h3>
                    <p className="text-gray-300 text-sm mb-6">{unsupportedError}</p>
                    <button onClick={() => setUnsupportedError(null)} className="w-full py-3 bg-red-600/80 hover:bg-red-500 text-white rounded-xl font-bold tracking-wider transition-colors">DISMISS</button>
                </div>
            </div>
        )}

       {/* Header */}
       <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-xl font-tech font-bold text-white tracking-widest flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
               </svg>
               DATA PORTAL
            </h2>
            <p className="text-[10px] font-mono text-gray-500 mt-1 pl-7 uppercase tracking-[0.2em]">Source Material Ingestion</p>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex bg-black/40 rounded-xl p-1 mb-8 border border-white/5 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-xs font-bold font-mono tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'upload' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
          >
            FILE STREAM
          </button>
          <button 
             onClick={() => setActiveTab('text')}
             className={`flex-1 py-3 text-xs font-bold font-mono tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'text' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
          >
            TEXT / PROMPT
          </button>
       </div>

       <div className="flex-1 min-h-[300px] flex flex-col relative group">
         <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
         
         {activeTab === 'upload' ? (
           <div className="h-full flex flex-col flex-1 relative z-10">
              {!file ? (
                <div 
                  onClick={() => !disabled && !processing && fileInputRef.current?.click()}
                  className={`
                    flex-1 border border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-500 cursor-pointer relative overflow-hidden
                    ${disabled || processing ? 'border-gray-800 opacity-50' : 'border-gray-700 hover:border-cyan-500/50 hover:bg-white/5'}
                  `}
                >
                  {processing ? (
                     <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                        <p className="text-xs font-mono text-cyan-400 animate-pulse tracking-widest">ANALYZING...</p>
                     </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-400 group-hover:text-cyan-300 transition-colors">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-gray-300 mb-2">INITIATE UPLOAD</p>
                      <p className="text-xs text-gray-600 font-mono">PDF • DOCX • TXT • MD</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.html,.js,.py,.png,.jpg,.jpeg,.webp,.pptx,.xlsx,.odt"
                    disabled={disabled || processing}
                  />
                </div>
              ) : (
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 p-8 flex flex-col items-center justify-center relative">
                   <button onClick={handleRemoveFile} disabled={disabled} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                   </button>
                   
                   <div className="w-24 h-24 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl border border-cyan-500/20 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-cyan-500/40 transition-colors">
                     <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                     <span className="text-lg font-bold font-mono text-cyan-400 z-10 drop-shadow-lg">{file.mimeType.split('/')[1]?.toUpperCase().slice(0, 4)}</span>
                   </div>
                   
                   <p className="font-mono text-sm text-gray-200 text-center truncate w-full px-8 mb-4">{file.name}</p>
                   
                   <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      Ready for Processing
                   </span>
                </div>
              )}
           </div>
         ) : (
           <textarea
             className="w-full flex-1 min-h-[300px] p-6 rounded-2xl border border-white/5 bg-black/40 text-sm font-mono text-gray-300 focus:border-cyan-500/50 focus:bg-black/60 outline-none resize-none placeholder:text-gray-700 transition-all shadow-inner custom-scrollbar selection:bg-cyan-500/30"
             placeholder="Enter raw content, prompt, or topic here..."
             value={textContext}
             onChange={(e) => {
               setTextContext(e.target.value);
               if(e.target.value) setFile(null);
             }}
             disabled={disabled}
           ></textarea>
         )}
       </div>
    </div>
  );
};