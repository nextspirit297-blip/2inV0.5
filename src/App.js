import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, LogOut, MessageSquare, Copy, Globe, ChevronDown } from 'lucide-react';

// --- الربط مع سوبابايس (ممنوع الحذف) ---
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const QUOTES = [
    { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
    { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "علي بن أبي طالب" },
    { text: "«من يعرف الآخرين فهو عالم، ومن يعرف نفسه فهو حكيم.»", author: "لاوتسو" },
    { text: "«معرفة نفسك هي بداية كل حكمة.»", author: "أرسطو" }
];

const TRANSLATIONS = {
    AR: { start: "ابدأ الرحلة الوجودية", prompt: "برومبت البصمة", input: "أدخل بصمتك هنا...", match: "توائمي" },
    EN: { start: "Start Existential Journey", prompt: "Vector Prompt", input: "Paste vector here...", match: "Find Twins" },
    RU: { start: "Начать путешествие", prompt: "Векторный запрос", input: "Вставьте код هنا...", match: "Найти близнецов" }
};

const Engine = {
    decode: (b64) => { try { return JSON.parse(atob(b64)).map(v => (v - 7.5) / 7.5); } catch { return null; } },
    calculate: (v1, v2) => {
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < 30; i++) { dot += v1[i] * v2[i]; n1 += v1[i] * v1[i]; n2 += v2[i] * v2[i]; }
        return dot / (Math.sqrt(n1) * Math.sqrt(n2));
    }
};

export default function App() {
    const [view, setView] = useState('landing');
    const [lang, setLang] = useState('AR');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => { setQuoteIdx(p => (p + 1) % QUOTES.length); setFade(true); }, 1000);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const t = TRANSLATIONS[lang];

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden select-none">
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote { color: #ffd700; text-shadow: 0 0 20px rgba(212, 175, 55, 0.5); }
                .quote-container { transition: all 1.5s ease-in-out; opacity: ${fade ? 1 : 0}; }
            `}</style>

            {/* Header: أزرار مكبرة وقائمة لغات حقيقية */}
            <header className="h-24 flex justify-between items-center px-10 z-[200] relative">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <button 
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="scale-[1.6] text-yellow-600/60 flex items-center gap-1 border border-yellow-600/20 px-2 py-1 rounded-lg bg-black"
                        >
                            <Globe size={14} /> <span className="text-[10px]">{lang}</span> <ChevronDown size={10} />
                        </button>
                        {showLangMenu && (
                            <div className="absolute top-12 left-0 bg-[#111] border border-yellow-600/30 rounded-xl w-32 overflow-hidden shadow-2xl z-[300]">
                                {['AR', 'EN', 'RU'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className="p-4 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="scale-[1.8] text-yellow-600/40 ml-4">
                        {music ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </div>
            </header>

            <main className="flex-1 relative z-50 flex flex-col items-center">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center w-full">
                        <div className="mt-[15vh] flex flex-col items-center">
                            <div className="flex items-baseline gap-6">
                                <span className="text-[15rem] font-black gold-text leading-none">2</span>
                                <span className="text-[10rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-5xl tracking-[1.6em] text-yellow-500 uppercase font-black mr-[-1.6em]">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[85%] py-12 border-2 border-yellow-600/30 rounded-full bg-yellow-900/5 text-4xl font-black text-yellow-500 uppercase tracking-widest active:scale-95 transition-all">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 w-full px-8 flex flex-col items-center space-y-6 mt-10">
                        <div className="w-full bg-white/5 border border-yellow-900/10 rounded-[3rem] p-8">
                            <span className="text-xl text-yellow-500 mb-4 block font-bold">{t.prompt}</span>
                            <div className="text-[10px] text-yellow-800/30 font-sans truncate">Act as a High-Resolution Psychological Vector Engine...</div>
                        </div>
                        {/* خانة البصمة: حجم وظيفي صغير للصق فقط */}
                        <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t.input}
                            className="w-full h-32 bg-black/60 border border-yellow-900/30 rounded-[2.5rem] p-6 text-xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none"
                        />
                        <button className="w-full py-10 bg-yellow-600 text-black font-black rounded-full text-4xl uppercase shadow-2xl">
                            {t.match}
                        </button>
                    </div>
                )}

                {/* سطر الحكم: في الأسفل دائماً */}
                <div className="absolute bottom-20 w-full px-10 text-center quote-container pointer-events-none">
                    <p className="text-2xl spiritual-quote italic mb-2">{QUOTES[quoteIdx].text}</p>
                    <p className="text-lg text-yellow-600/40">— {QUOTES[quoteIdx].author}</p>
                </div>
            </main>
        </div>
    );
}
