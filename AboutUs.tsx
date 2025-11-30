import React, { useState } from 'react';
import { AdminConfig } from './types';

interface AboutUsProps {
    config: AdminConfig;
}

export const AboutUs: React.FC<AboutUsProps> = ({ config }) => {
    const [review, setReview] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending email via mailto
        const subject = `Study.AI Review from ${name}`;
        const body = `Review:\n${review}\n\nFrom User: ${name}`;
        window.location.href = `mailto:syedmuhammedattafaridshah@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSubmitted(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-20">
            {/* Hero Profile Section */}
            <div className="glass-panel p-10 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10 border border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none"></div>
                
                <div className="relative group flex-shrink-0">
                     <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                     <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-black/50 shadow-2xl">
                        <img src={config.profileImage} alt={config.ownerName} className="w-full h-full object-cover" />
                     </div>
                </div>

                <div className="text-center md:text-left z-10">
                    <h2 className="text-4xl font-tech font-bold text-white mb-2 text-glow">{config.ownerName}</h2>
                    <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-6">Founder & Lead Developer • 2nd Year Student</p>
                    <div className="bg-black/30 p-6 rounded-xl border border-white/5 text-slate-300 leading-relaxed max-w-xl mx-auto md:mx-0">
                         {config.ownerBio}
                    </div>
                </div>
            </div>

            {/* Platform Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-tech text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-400">//</span> MISSION
                    </h3>
                    <p className="text-slate-400 text-sm leading-7">
                        Study.AI is designed to revolutionize the way students and educators generate assessments. 
                        By leveraging advanced proprietary LLM architectures, we transform static documents into 
                        dynamic, verifiable knowledge checks in seconds.
                    </p>
                </div>
                 <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-tech text-white mb-4 flex items-center gap-2">
                        <span className="text-cyan-400">//</span> ARCHITECTURE
                    </h3>
                    <p className="text-slate-400 text-sm leading-7">
                        Built on a secure, high-performance React framework. 
                        Powered by our proprietary Study AI Neural Engine. 
                        Features include real-time PDF rendering, secure data ingestion, and a luxury cyber-interface.
                    </p>
                </div>
            </div>

            {/* Review Form */}
            <div className="glass-panel p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-pink-900/10"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-tech font-bold text-white mb-6 text-center">SUBMIT FEEDBACK</h3>
                    
                    {!submitted ? (
                        <form onSubmit={handleSubmitReview} className="max-w-lg mx-auto space-y-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none"
                                    placeholder="Enter identifier..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Message</label>
                                <textarea 
                                    required
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none resize-none"
                                    placeholder="Share your experience or report bugs..."
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold font-mono tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-900/20">
                                TRANSMIT REVIEW
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                             <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                             </div>
                             <h4 className="text-xl font-bold text-white mb-2">TRANSMISSION SUCCESSFUL</h4>
                             <p className="text-slate-400">Thank you for your feedback. Opening email client...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};