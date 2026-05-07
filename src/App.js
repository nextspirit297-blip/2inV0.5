import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, LogOut, Send, MessageSquare, Image as ImageIcon, Mic, ChevronLeft, Copy, Globe } from 'lucide-react';

const QUOTES = [
    { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
    { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "الإمام علي بن أبي طالب" },
    { text: "«من يعرف الآخرين فهو عالم، ومن يعرف نفسه فهو حكيم.»", author: "لاوتسو" },
    { text: "«معرفة نفسك هي بداية كل حكمة.»", author: "أرسطو" },
    { text: "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.»", author: "جلال الدين الرومي" }
];

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine."...`;

export default function App() {
    const [view, setView] = useState('landing');
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [lang, setLang] = useState('AR');

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
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote {
                    color: #ffd700;
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
                    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
                }
                .author-name { color: rgba(212, 175, 55, 0.6); font-family: sans-serif; letter-spacing: 0.1em; }
                .quote-container { transition: all 1.5s ease-in-out; opacity: ${fade ? 1 : 0}; transform: translateY(${fade ? '0' : '10px'}); }
                .custom-blur { backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); }
            `}</style>

            {/* سطر الحكم المطوّر مع اسم صاحب الإقتباس */}
            <div className="absolute top-[72%] left-0 w-full px-10 pointer-events-none z-10 text-center quote-container">
                <p className="text-2xl md:text-4xl spiritual-quote italic font-medium mb-3">
                    {QUOTES[quoteIdx].text}
                </p>
                <p className="text-lg author-name font-light">
                    — {QUOTES[quoteIdx].author}
                </p>
            </div>

            {/* Header: إضافة زر اللغة والتحكم */}
            <header className="h-20 flex justify-between items-center px-8 z-[100] relative">
                <div className="flex items-center gap-4">
                    <button onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')} className="text-yellow-600/60 flex items-center gap-2 border border-yellow-600/20 px-3 py-1 rounded-full text-xs">
                        <Globe size={14} /> {lang}
                    </button>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/40">
                        {music ? <Volume2 size={22} /> : <VolumeX size={22} />}
                    </button>
                </div>
                {view !== 'landing' && (
                    <button onClick={() => setView('landing')} className="text-red-900/30"><LogOut size={22} /></button>
                )}
            </header>

            <main className="flex-1 relative z-50 flex flex-col overflow-hidden">
                
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center relative h-full">
                        {/* العنوان: ميزان الـ TWIN في المركز */}
                        <div className="absolute top-[22%] flex flex-col items-center w-full">
                            <div className="flex items-baseline gap-6 mb-2">
                                <span className="text-[14rem] font-black gold-text leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">2</span>
                                <span className="text-[10rem] font-thin text-yellow-600/40 leading-none">in</span>
                            </div>
                            {/* كلمة TWIN الآن في السنتر تماماً تحت الفراغ */}
                            <p className="text-4xl tracking-[1.8em] text-yellow-500 uppercase font-black opacity-80 mr-[-1.8em]">
                                twin
                            </p>
                        </div>

                        {/* زر الدخول */}
                        <div className="absolute top-[52%] w-full flex justify-center">
                            <button 
                                onClick={() => setView('onboarding')}
                                className="w-[85%] py-12 border border-yellow-600/30 rounded-full bg-yellow-900/5 custom-blur shadow-[0_0_80px_rgba(212,175,55,0.1)] active:scale-95 transition-all"
                            >
                                <span className="text-4xl font-black text-yellow-500 uppercase tracking-widest">
                                    ابدأ الرحلة الوجودية
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* بقية الواجهات (Onboarding/Main) تبقى ثابتة مع تحسين النصوص */}
                {view === 'onboarding' && (
                   <div className="flex-1 flex flex-col px-8 py-4 space-y-6 overflow-y-auto pb-44 relative z-[60]">
                        <div className="bg-white/5 border border-yellow-900/10 rounded-[3rem] p-8 shadow-2xl">
                            <span className="text-2xl font-bold text-yellow-500 block mb-4">برومبت البصمة</span>
                            <div className="text-sm text-yellow-800/40 leading-relaxed font-sans border-t border-yellow-900/10 pt-4">
                                {PROMPT_TEXT}
                            </div>
                        </div>
                        <textarea 
                            placeholder="أدخل بصمتك هنا..."
                            className="w-full flex-1 min-h-[200px] bg-black/40 border border-yellow-900/20 rounded-[3rem] p-10 text-yellow-100 text-3xl outline-none focus:border-yellow-600 shadow-inner italic"
                        />
                        <button onClick={() => setView('main')} className="w-full py-10 bg-yellow-600 text-black font-black rounded-full text-4xl uppercase tracking-widest">
                            توائمي
                        </button>
                   </div>
                )}
            </main>
        </div>
    );
}
