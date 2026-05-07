import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, LogOut, Send, MessageSquare, Image as ImageIcon, Mic, ChevronLeft, Copy } from 'lucide-react';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const QUOTES = [
    "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية.»",
    "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»",
    "«من ينظر إلى الخارج يحلم، ومن ينظر إلى الداخل يستيقظ.»",
    "«معرفة نفسك هي بداية كل حكمة.»",
    "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.»"
];

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine."...`;

export default function App() {
    const [view, setView] = useState('landing');
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const qInterval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setQuoteIdx(p => (p + 1) % QUOTES.length);
                setFade(true);
            }, 1000);
        }, 10000);
        return () => clearInterval(qInterval);
    }, []);

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden select-none">
            
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff 0%, #d4af37 50%, #4a3712 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .quote-layer { transition: opacity 2s ease-in-out; opacity: ${fade ? 0.4 : 0}; }
                .custom-blur { backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
            `}</style>

            {/* سطر الحكم: طبقة مستقلة خلفية تظهر دائماً */}
            <div className="absolute top-[75%] left-0 w-full px-10 pointer-events-none z-0 text-center">
                <p className="text-xl md:text-3xl text-yellow-600/50 italic leading-snug quote-layer font-light">
                    {QUOTES[quoteIdx]}
                </p>
            </div>

            {/* Header */}
            <header className="h-20 flex justify-between items-center px-8 z-[100] relative">
                <div className="flex flex-col leading-none">
                    {view !== 'landing' && (
                        <>
                            <span className="text-4xl font-black text-yellow-500 tracking-tighter">2in</span>
                            <span className="text-[8px] text-yellow-700 tracking-[0.4em] uppercase font-sans">twin</span>
                        </>
                    )}
                </div>
                <button onClick={() => setMusic(!music)} className="text-yellow-600/40">
                    {music ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
            </header>

            {/* Main Area */}
            <main className="flex-1 relative z-50 flex flex-col overflow-hidden">
                
                {/* 1. Landing View */}
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center relative h-full">
                        {/* العنوان: رُفع بنسبة 35% */}
                        <div className="absolute top-[15%] transform -translate-y-1/2 text-center w-full">
                            <h1 className="text-[12rem] font-black tracking-tighter gold-text leading-none drop-shadow-[0_0_50px_rgba(212,175,55,0.3)]">2in</h1>
                            <p className="text-2xl tracking-[1.5em] text-yellow-700 uppercase font-bold ml-6">twin</p>
                        </div>

                        {/* زر الدخول: ضُخم بنسبة 70% ورُفع بنسبة 20% من موضعه الأصلي */}
                        <div className="absolute top-[55%] w-full flex justify-center">
                            <button 
                                onClick={() => setView('onboarding')}
                                className="scale-[1.7] px-10 py-10 border border-yellow-600/30 rounded-full text-yellow-500 text-sm font-black uppercase tracking-[0.2em] bg-yellow-900/5 custom-blur shadow-[0_0_80px_rgba(212,175,55,0.1)] active:scale-[1.6] transition-transform"
                            >
                                ابدأ الرحلة
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. Onboarding View */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex flex-col px-8 py-4 space-y-6 overflow-y-auto pb-40 relative z-[60]">
                        <div className="bg-white/5 border border-yellow-900/10 rounded-[2.5rem] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-yellow-600 font-bold">برومبت البصمة</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-2 text-yellow-700"><Copy size={18}/></button>
                            </div>
                            <div className="text-[10px] text-yellow-900/40 leading-relaxed font-sans max-h-20 overflow-y-auto border-t border-yellow-900/10 pt-4">
                                {PROMPT_TEXT}
                            </div>
                        </div>
                        <textarea 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="أدخل بصمتك هنا..."
                            className="w-full flex-1 min-h-[200px] bg-black/60 border border-yellow-900/20 rounded-[2.5rem] p-8 text-yellow-100 text-xl outline-none focus:border-yellow-600 resize-none shadow-inner"
                        />
                        <button 
                            onClick={() => setView('main')}
                            className="w-full py-8 bg-yellow-600 text-black font-black rounded-full text-2xl uppercase tracking-widest shadow-2xl active:scale-95 transition-transform"
                        >
                            {loading ? "..." : "توائمي"}
                        </button>
                    </div>
                )}

                {/* 3. Main View (Results) */}
                {view === 'main' && (
                    <div className="flex-1 flex flex-col px-6 overflow-hidden relative">
                        <div className="flex-1 overflow-y-auto space-y-4 pb-60 pr-1">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="bg-white/5 border border-yellow-900/10 p-7 rounded-[2.5rem] flex justify-between items-center backdrop-blur-sm">
                                    <div>
                                        <h4 className="text-2xl font-bold text-gray-100 italic">كيان وجودي #{i+1}</h4>
                                        <p className="text-[10px] text-yellow-800 tracking-[0.3em] uppercase mt-1">تطابق: {99-i}%</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-yellow-900/20 flex items-center justify-center text-yellow-700">?</div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setView('messages')}
                            className="fixed bottom-32 right-8 w-20 h-20 bg-yellow-600 text-black rounded-full flex items-center justify-center shadow-2xl z-[100] active:scale-90 transition-transform"
                        >
                            <MessageSquare size={32} />
                        </button>
                    </div>
                )}

                {/* 4. Messages View */}
                {view === 'messages' && (
                    <div className="flex-1 flex flex-col px-6 pb-40 overflow-hidden relative z-[70]">
                        <div className="flex items-center gap-4 h-16 mb-4">
                            <button onClick={() => setView('main')} className="text-yellow-600"><ChevronLeft size={40}/></button>
                            <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-widest">المحادثات</h2>
                        </div>
                        <div className="flex-1 bg-white/5 border border-yellow-900/10 rounded-[3.5rem] p-8 flex flex-col overflow-hidden">
                            <div className="flex-1 flex items-center justify-center text-gray-800 italic text-2xl opacity-10 text-center">تحدث مع توأمك الروحي</div>
                            <div className="mt-4 flex items-center gap-3 bg-black border border-yellow-900/30 rounded-full p-3 pl-6 shadow-2xl">
                                <button className="text-yellow-700"><ImageIcon size={24}/></button>
                                <input type="text" placeholder="تحدث..." className="flex-1 bg-transparent border-none outline-none text-xl text-yellow-100" />
                                <button className="text-yellow-700"><Mic size={24}/></button>
                                <button className="w-14 h-14 bg-yellow-600 text-black rounded-full flex items-center justify-center active:scale-90"><Send size={20}/></button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
