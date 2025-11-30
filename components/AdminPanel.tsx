import React, { useState, useRef } from 'react';
import { AdminConfig } from '../types';

interface AdminPanelProps {
    config: AdminConfig;
    onUpdateConfig: (newConfig: AdminConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Editing State
    const [editName, setEditName] = useState(config.ownerName);
    const [editBio, setEditBio] = useState(config.ownerBio);
    const [editImage, setEditImage] = useState(config.profileImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Exact credentials check as requested
        if (userId === 'rt56i//()!?+-3@uio' && password === "34_-+()//9AsDf56&&*'@") {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError("Invalid access granted if any one give wrong password or I'd or both");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setEditImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdateConfig({
            ownerName: editName,
            ownerBio: editBio,
            profileImage: editImage
        });
        alert("System Configuration Updated Successfully.");
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 glass-panel rounded-3xl border border-red-900/30 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-600"></div>
                <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-tech font-bold text-white tracking-widest">RESTRICTED ACCESS</h2>
                     <p className="text-red-400/60 font-mono text-xs mt-2 uppercase">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input 
                            type="text" 
                            placeholder="User ID Key"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-black/40 border border-red-500/20 rounded-xl px-5 py-3 text-red-100 placeholder:text-red-900 focus:border-red-500 outline-none font-mono text-sm"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Security Token"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-red-500/20 rounded-xl px-5 py-3 text-red-100 placeholder:text-red-900 focus:border-red-500 outline-none font-mono text-sm"
                        />
                    </div>
                    
                    {error && (
                        <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-[10px] font-mono text-red-400 text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="w-full py-4 bg-red-900/50 hover:bg-red-800 border border-red-500/30 rounded-xl text-red-100 font-bold font-mono tracking-widest hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all">
                        AUTHENTICATE
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
            <div className="glass-panel p-10 rounded-3xl border border-cyan-500/30 shadow-2xl">
                 <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-2xl font-tech font-bold text-white">ADMINISTRATOR CONTROL</h2>
                        <p className="text-emerald-400 font-mono text-xs mt-1 uppercase tracking-widest">Root Access Granted</p>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="text-xs text-slate-500 hover:text-white uppercase tracking-widest">Logout</button>
                 </div>

                 <div className="space-y-8">
                     <div>
                        <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Owner Name</label>
                        <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 outline-none"
                        />
                     </div>
                     
                     <div>
                        <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Profile Image</label>
                        <div className="flex gap-4 items-start">
                             <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-3 bg-black/40 border border-white/10 hover:border-cyan-500/50 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        UPLOAD IMAGE
                                    </button>
                                    <span className="text-[10px] text-slate-600 uppercase tracking-wide">OR PASTE URL BELOW</span>
                                </div>
                                <input 
                                    type="text" 
                                    value={editImage} 
                                    onChange={(e) => setEditImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 outline-none font-mono text-xs"
                                />
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                             </div>
                            
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex-shrink-0 relative group">
                                <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none"></div>
                            </div>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Bio / Description</label>
                        <textarea 
                            value={editBio} 
                            onChange={(e) => setEditBio(e.target.value)}
                            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 outline-none resize-none"
                        />
                     </div>

                     <div className="pt-6 border-t border-white/10 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all font-mono tracking-wider"
                        >
                            SAVE CHANGES
                        </button>
                     </div>
                 </div>
            </div>
        </div>
    );
};