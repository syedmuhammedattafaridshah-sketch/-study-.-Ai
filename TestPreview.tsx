import React, { useState } from 'react';
import { TestData } from './types';

interface TestPreviewProps {
  data: TestData;
  onUpdate?: (newData: TestData) => void;
}

export const TestPreview: React.FC<TestPreviewProps> = ({ data, onUpdate }) => {
  const [draggedItem, setDraggedItem] = useState<{ section: keyof TestData; index: number } | null>(null);

  const handleDragStart = (e: React.DragEvent, section: keyof TestData, index: number) => {
    setDraggedItem({ section, index });
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay for visual effect
    setTimeout(() => {
        if(e.target instanceof HTMLElement) e.target.classList.add('opacity-40');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if(e.target instanceof HTMLElement) e.target.classList.remove('opacity-40');
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSection: keyof TestData, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem || !onUpdate) return;
    if (draggedItem.section !== targetSection) return;

    const list = data[targetSection] as any[];
    if (!Array.isArray(list)) return;

    const newList = [...list];
    const [movedItem] = newList.splice(draggedItem.index, 1);
    newList.splice(targetIndex, 0, movedItem);

    onUpdate({ ...data, [targetSection]: newList });
  };

  const deleteItem = (section: keyof TestData, index: number) => {
    if (!onUpdate) return;
    const list = data[section] as any[];
    if (!Array.isArray(list)) return;
    
    const newList = list.filter((_, i) => i !== index);
    onUpdate({ ...data, [section]: newList });
  };

  const toggleFlag = (section: keyof TestData, index: number) => {
    if (!onUpdate) return;
    const list = data[section] as any[];
    if (!Array.isArray(list)) return;

    const newList = [...list];
    newList[index] = { ...newList[index], isFlagged: !newList[index].isFlagged };
    onUpdate({ ...data, [section]: newList });
  };

  const ControlPanel = ({ section, index, isFlagged }: { section: keyof TestData, index: number, isFlagged?: boolean }) => {
     if (!onUpdate) return null;
     return (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur shadow-sm rounded-lg border border-slate-200 p-1 z-20">
           {/* Flag for Review */}
           <button 
             onClick={() => toggleFlag(section, index)}
             className={`p-1.5 rounded transition-colors ${isFlagged ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
             title={isFlagged ? "Marked for Review" : "Flag for Review"}
           >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFlagged ? "currentColor" : "none"} strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
           </button>
           <div className="w-px h-4 bg-slate-200 mx-1"></div>
           <div className="p-1.5 text-slate-400 cursor-grab active:cursor-grabbing hover:text-cyan-600 rounded hover:bg-slate-100" title="Drag to Reorder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
           </div>
           <div className="w-px h-4 bg-slate-200 mx-1"></div>
           <button 
             onClick={() => deleteItem(section, index)}
             className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
             title="Remove Question"
           >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
           </button>
        </div>
     );
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden max-w-[210mm] mx-auto min-h-[297mm] text-slate-800 relative transform transition-all duration-700">
      
      {/* Decorative Top Bar */}
      <div className="h-3 bg-slate-900 flex">
         <div className="w-1/3 bg-cyan-500"></div>
         <div className="w-1/3 bg-blue-600"></div>
         <div className="w-1/3 bg-purple-600"></div>
      </div>

      <div className="p-16 font-sans">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-12">
          <div className="max-w-[70%]">
             <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight uppercase">{data.title}</h1>
             {data.subtitle ? (
               <p className="text-lg text-slate-500 font-medium">{data.subtitle}</p>
             ) : (
               <p className="text-slate-400 text-sm mt-2">Generated Examination Paper</p>
             )}
          </div>
          <div className="text-right">
             <div className="text-2xl font-black text-slate-200 tracking-tighter uppercase">STUDY.AI</div>
             <div className="text-[10px] text-slate-300 font-mono mt-1">SECURE OUTPUT</div>
          </div>
        </div>
        
        <div className="space-y-16">
          
          {/* I. MCQs */}
          {data.mcqs?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">01</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-cyan-500 pb-1">
                   Multiple Choice
                 </h3>
              </div>
              <div className="space-y-6">
                {data.mcqs.map((q, idx) => (
                  <div 
                    key={idx} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'mcqs', idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'mcqs', idx)}
                    className={`group relative border rounded-lg p-4 -m-4 transition-all cursor-default ${q.isFlagged ? 'bg-amber-50 border-amber-200 shadow-sm' : 'border-transparent hover:border-slate-200 hover:bg-slate-50/50'}`}
                  >
                    <ControlPanel section="mcqs" index={idx} isFlagged={q.isFlagged} />
                    {q.isFlagged && <div className="absolute top-2 left-2 text-[10px] font-bold text-amber-500 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">Review Needed</div>}
                    
                    <p className="font-semibold text-slate-900 mb-4 text-lg leading-relaxed pr-8 pt-2">
                      <span className="text-cyan-600 font-bold mr-3">{idx + 1}.</span>{q.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* II. True/False */}
          {data.trueFalse?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">02</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-purple-500 pb-1">
                   True or False
                 </h3>
              </div>
              <div className="space-y-2">
                {data.trueFalse.map((q, idx) => (
                  <div 
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'trueFalse', idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'trueFalse', idx)}
                    className={`group relative flex justify-between items-center py-4 border-b border-slate-50 last:border-0 px-4 -mx-4 rounded-lg transition-all ${q.isFlagged ? 'bg-amber-50' : 'hover:bg-slate-50/50'}`}
                  >
                    <ControlPanel section="trueFalse" index={idx} isFlagged={q.isFlagged} />
                    <p className="text-slate-800 pr-12 font-medium text-lg">
                      <span className="text-purple-500 font-bold mr-3">{idx + 1}.</span>{q.statement}
                    </p>
                    <div className="flex gap-4 font-mono text-xs font-bold text-slate-300">
                       <span>TRUE</span>
                       <span>FALSE</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* III. Fill in Blanks */}
          {data.fillInBlanks?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">03</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-blue-500 pb-1">
                   Fill in the Blanks
                 </h3>
              </div>
              <div className="space-y-4">
                {data.fillInBlanks.map((q, idx) => (
                  <div 
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'fillInBlanks', idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'fillInBlanks', idx)}
                    className={`group relative p-6 rounded-lg border-l-4 transition-all border border-slate-100 ${q.isFlagged ? 'bg-amber-50 border-amber-300 shadow-sm' : 'bg-slate-50 border-blue-200 hover:bg-white hover:shadow-md'}`}
                  >
                     <ControlPanel section="fillInBlanks" index={idx} isFlagged={q.isFlagged} />
                     <p className="text-slate-800 text-lg leading-loose pr-8">
                       <span className="text-blue-500 font-bold mr-3">{idx + 1}.</span>{q.sentence}
                     </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* IV. Matching */}
          {data.matching?.length > 0 && data.matching[0].pairs.length > 0 && (
             <section>
               <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">04</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-emerald-500 pb-1">
                   Matching
                 </h3>
              </div>
              <div className="grid grid-cols-2 gap-12 bg-slate-50 rounded-xl p-8 border border-slate-100 relative group">
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => deleteItem('matching', 0)} className="text-red-400 text-xs hover:text-red-600 font-bold uppercase bg-white px-2 py-1 rounded shadow-sm">Remove Section</button>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-400 text-sm uppercase tracking-widest mb-6 border-b pb-2">Column A</h4>
                    <div className="space-y-6">
                        {data.matching[0].pairs.map((pair, idx) => (
                            <div key={`a-${idx}`} className="flex gap-4 items-start">
                                <span className="text-slate-400 font-bold min-w-[20px]">{idx + 1}.</span>
                                <span className="text-slate-800 font-medium">{pair.item}</span>
                            </div>
                        ))}
                    </div>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-400 text-sm uppercase tracking-widest mb-6 border-b pb-2">Column B</h4>
                    <div className="space-y-6">
                        {data.matching[0].pairs.map((pair, idx) => (
                            <div key={`b-${idx}`} className="flex gap-4 items-start">
                                <span className="text-slate-400 font-bold min-w-[20px]">{String.fromCharCode(65 + idx)}.</span>
                                <span className="text-slate-800 font-medium">{pair.match}</span>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
             </section>
          )}

          {/* V. Short Answer */}
          {data.shortQuestions?.length > 0 && (
            <section>
               <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">05</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-orange-500 pb-1">
                   Short Answer
                 </h3>
              </div>
               <div className="space-y-6">
                 {data.shortQuestions.map((q, idx) => (
                   <div 
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'shortQuestions', idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'shortQuestions', idx)}
                    className={`group relative p-4 -m-4 rounded-xl transition-all border ${q.isFlagged ? 'bg-amber-50 border-amber-200' : 'border-transparent hover:bg-slate-50/50 hover:border-slate-200'}`}
                   >
                      <ControlPanel section="shortQuestions" index={idx} isFlagged={q.isFlagged} />
                      <p className="font-semibold text-slate-900 mb-6 text-lg pr-8">
                        <span className="text-orange-500 font-bold mr-3">{idx + 1}.</span>{q.question}
                      </p>
                      <div className="h-24 bg-white rounded border border-slate-200 w-full shadow-inner"></div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* VI. Long Answer */}
          {data.longQuestions?.length > 0 && (
            <section>
               <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">06</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-indigo-500 pb-1">
                   Long Answer
                 </h3>
              </div>
               <div className="space-y-8">
                 {data.longQuestions.map((q, idx) => (
                   <div 
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'longQuestions', idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'longQuestions', idx)}
                    className={`group relative p-4 -m-4 rounded-xl transition-all border ${q.isFlagged ? 'bg-amber-50 border-amber-200' : 'border-transparent hover:bg-slate-50/50 hover:border-slate-200'}`}
                   >
                      <ControlPanel section="longQuestions" index={idx} isFlagged={q.isFlagged} />
                      <p className="font-semibold text-slate-900 mb-6 text-xl pr-8">
                        <span className="text-indigo-500 font-bold mr-3">{idx + 1}.</span>{q.question}
                      </p>
                      <div className="h-40 bg-slate-50 rounded border border-slate-100 w-full shadow-inner p-4">
                        <div className="w-full h-full border-b border-dashed border-slate-300/50"></div>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* VII. Essays */}
          {data.essays?.length > 0 && (
             <section>
               <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-black text-slate-200">07</span>
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-pink-500 pb-1">
                   Essay Questions
                 </h3>
               </div>
               <div className="space-y-10">
                 {data.essays.map((q, idx) => (
                   <div 
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'essays', idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'essays', idx)}
                    className={`group relative p-4 -m-4 rounded-xl transition-all border ${q.isFlagged ? 'bg-amber-50 border-amber-200' : 'border-transparent hover:bg-slate-50/50 hover:border-slate-200'}`}
                   >
                      <ControlPanel section="essays" index={idx} isFlagged={q.isFlagged} />
                      <p className="font-semibold text-slate-900 mb-6 text-xl pr-8">
                        <span className="text-pink-500 font-bold mr-3">{idx + 1}.</span>{q.question}
                      </p>
                      <div className="space-y-4">
                         {[1,2,3,4,5,6].map(l => (
                            <div key={l} className="border-b border-slate-200 h-8 w-full"></div>
                         ))}
                      </div>
                   </div>
                 ))}
               </div>
             </section>
          )}

        </div>
        
        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[10px] font-mono uppercase tracking-widest">
          <span>AI Generated Assessment // {new Date().toLocaleDateString()}</span>
          <span>Study.AI Architecture</span>
        </div>
      </div>
    </div>
  );
};