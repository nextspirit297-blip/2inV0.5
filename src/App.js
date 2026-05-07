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

    useEffect(() => {
        const qInterval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setQuoteIdx(p => (p + 1) % QUOTES.length);
                setFade(true);
            }, 1000);
        }, 12000);
        return () => clearInterval(qInterval);
    }, []);

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden select-none">
            
            <style>{`
                /* تمييز الرقم 2 عن كلمة in بوضوح تام */
                .digit-2 { 
                    background: linear-gradient(to bottom, #ffffff, #d4af37); 
                    -webkit-background-clip: text; 
                    -webkit-text-fill-color: transparent;
                }
                .text-in { 
                    color: rgba(212, 175, 55, 0.6); 
                    font-weight: 200;
                }
                
                .spiritual-quote {
                    color: #ffd700;
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.4);
                    filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
                    line-height: 1.8;
                }
                .quote-container { transition: opacity 1.5s ease-in-out; opacity: ${fade ? 1 : 0}; }
                .custom-blur { backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); }
            `}</style>

            {/* سطر الحكم: التوهج الذهبي الأقصى */}
            <div className="absolute top-[72%] left-0 w-full px-10 pointer-events-none z-10 text-center quote-container">
                <p className="text-3xl md:text-5xl spiritual-quote italic font-medium">
                    {QUOTES[quoteIdx]}
                </p>
            </div>

            <header className="h-20 flex justify-between items-center px-8 z-[100] relative">
                {view !== 'landing' && (
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white">2</span>
                        <span className="text-2xl font-light text-yellow-600">in</span>
                    </div>
                )}
                <button onClick={() => setMusic(!music)} className="text-yellow-600/40 ml-auto">
                    {music ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
            </header>

            <main className="flex-1 relative z-50 flex flex-col overflow-hidden">
                
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center relative h-full">
                        {/* هندسة الشعار لمنع قراءة sin */}
                        <div className="absolute top-[20%] text-center w-full">
                            <div className="flex justify-center items-baseline gap-4">
                                <span className="text-[14rem] font-black digit-2 leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">2</span>
                                <span className="text-[10rem] font-thin text-in leading-none tracking-tighter">in</span>
                            </div>
                            <p className="text-4xl tracking-[1.2em] text-yellow-500 uppercase font-black mt-6 opacity-90">
                                twin
                            </p>
                        </div>

                        {/* زر الدخول الضخم */}
                        <div className="absolute top-[52%] w-full flex justify-center">
                            <button 
                                onClick={() => setView('onboarding')}
                                className="w-[88%] py-12 border-2 border-yellow-600/50 rounded-full bg-yellow-900/10 custom-blur shadow-[0_0_120px_rgba(212,175,55,0.2)] active:scale-95 transition-all"
                            >
                                <span className="text-5xl font-black text-yellow-500 uppercase tracking-[0.2em] drop-shadow-2xl">
                                    ابدأ الرحلة
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Onboarding View */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex flex-col px-8 py-4 space-y-6 overflow-y-auto pb-44 relative z-[60]">
                        <div className="bg-white/5 border border-yellow-900/10 rounded-[3rem] p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 text-yellow-500">
                                <span className="text-2xl font-bold">برومبت البصمة الوجودية</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-3 bg-yellow-600/10 rounded-2xl"><Copy size={24}/></button>
                            </div>
                            <div className="text-sm text-yellow-800/40 leading-relaxed font-sans max-h-24 overflow-y-auto no-scrollbar border-t border-yellow-900/10 pt-4">
                                {PROMPT_TEXT}
                            </div>
                        </div>
                        <textarea 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="أدخل شفرتك هنا..."
                            className="w-full flex-1 min-h-[250px] bg-black/60 border border-yellow-900/20 rounded-[3.5rem] p-10 text-yellow-100 text-3xl outline-none focus:border-yellow-600 resize-none shadow-inner italic"
                        />
                        <button 
                            onClick={() => setView('main')}
                            className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-4xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                        >
                            توائمي
                        </button>
                    </div>
                )}

                {/* Main View (Radar) */}
                {view === 'main' && (
                    <div className="flex-1 flex flex-col px-6 overflow-hidden relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-64 pr-1">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="bg-white/5 border border-yellow-900/10 p-10 rounded-[3.5rem] flex justify-between items-center backdrop-blur-md active:bg-yellow-600/10 transition-all shadow-xl">
                                    <div>
                                        <h4 className="text-4xl font-bold text-gray-100 italic">كيان {i+1}</h4>
                                        <p className="text-[14px] text-yellow-700 tracking-[0.5em] uppercase mt-3 font-black">تطابق: {99-i}%</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border-2 border-yellow-900/40 flex items-center justify-center text-yellow-600 font-black text-2xl">?</div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setView('messages')}
                            className="fixed bottom-36 right-8 w-28 h-28 bg-yellow-600 text-black rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.4)] z-[100] active:scale-90"
                        >
                            <MessageSquare size={44} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
