import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, ChevronDown } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine."...`;

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: [
            "1. قم بنسخ البرومبت الكامل من الصندوق أدناه.",
            "2. توجه إلى أي ذكاء اصطناعي (مثل Gemini، ChatGPT).",
            "3. امنحه البرومبت؛ وتذكر أنه كلما كان حوارك أعمق، كانت البصمة أدق.",
            "4. قم بنسخ كود Base64 الناتج وألصقه هنا."
        ],
        input: "أدخل بصمتك الوجودية هنا...",
        match: "فك تشفير البصمة",
        // تصحيح التشوه اللغوي
        resultsTitle: "الـصّـدَى الـوُجُـودِيّ",
        retry: "تحديث البصمة",
        quotes: [
            { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" }
        ]
    }
};

const Engine = {
    decode: (b64) => { 
        try { 
            return JSON.parse(atob(b64.trim())).map(v => (v - 7.5) / 7.5); 
        } catch { return null; } 
    },
    calculate: (v1, v2) => {
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < 30; i++) { dot += v1[i] * v2[i]; n1 += v1[i] * v1[i]; n2 += v2[i] * v2[i]; }
        const sim = dot / (Math.sqrt(n1) * Math.sqrt(n2));
        return isNaN(sim) ? 0 : sim;
    }
};

export default function App() {
    const [view, setView] = useState('landing');
    const [lang, setLang] = useState('AR');
    const [music, setMusic] = useState(false);
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [showLang, setShowLang] = useState(false);
    const [results, setResults] = useState([]);

    // إدارة دورة الحكم
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => { setFade(true); }, 1000);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    const t = TRANSLATIONS[lang];

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden select-none" dir="rtl">
            
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote { color: #ffd700; text-shadow: 0 0 25px rgba(212, 175, 55, 0.4); }
                
                /* هندسة الـ RTL لمنع التشوه اللغوي */
                input, textarea, table, p, h1, h2 { direction: rtl; unicode-bidi: embed; }
            `}</style>
            
            {music && <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" />}

            {/* Header */}
            <header className="h-28 flex justify-between items-center px-10 z-[200]">
                <div className="flex items-center gap-12 scale-[1.7]">
                    <button onClick={() => setShowLang(!showLang)} className="text-yellow-600/70 border border-yellow-600/30 px-3 py-1 rounded-lg bg-black flex items-center gap-2">
                        <Globe size={14} /> <span className="text-[10px] font-bold">{lang}</span>
                    </button>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/50">{music ? <Volume2 /> : <VolumeX />}</button>
                </div>
            </header>

            <main className="flex-1 relative z-50 flex flex-col items-center">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center w-full">
                        <div className="mt-[10vh] flex flex-col items-center">
                            {/* تصحيح الانعكاس: يجب أن يكون dir="ltr" لتظهر 2in */}
                            <div className="flex items-baseline gap-8" dir="ltr">
                                <span className="text-[16rem] font-black gold-text leading-none">2</span>
                                <span className="text-[11rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-6xl tracking-[1.6em] text-yellow-500 uppercase font-black mr-[-1.6em]" dir="ltr">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[88%] py-14 border-2 border-yellow-600/40 rounded-full text-5xl font-black text-yellow-500 uppercase">{t.start}</button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 w-full px-10 flex flex-col items-center space-y-8 mt-4 overflow-y-auto pb-60">
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[3.5rem] p-10 relative">
                            <div className="flex justify-between items-center mb-8 border-b border-yellow-900/20 pb-6">
                                <span className="text-5xl font-bold text-yellow-500">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-6 bg-yellow-600 text-black rounded-3xl active:scale-90"><Copy size={38} /></button>
                            </div>
                            <div className="space-y-6 mb-10 text-right">
                                {t.guide.map((line, idx) => <p key={idx} className="text-3xl text-yellow-600 font-bold leading-snug">{line}</p>)}
                            </div>
                            <div className="text-xl text-white/10 italic font-sans max-h-32 overflow-hidden">{PROMPT_TEXT}</div>
                        </div>
                        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={t.input} className="w-full h-56 bg-black/80 border border-yellow-900/30 rounded-[3rem] p-10 text-4xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none" />
                        <button onClick={() => setView('results')} className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-5xl uppercase shadow-2xl">{loading ? "..." : t.match}</button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="flex-1 w-full px-10 flex flex-col items-center">
                        {/* عنوان مصحح ومشكل يدوياً لضمان عدم التشوه */}
                        <h2 className="text-6xl font-bold gold-text mb-12 tracking-wide dir-rtl">الـصّـدَى الـوُجُـودِيّ</h2>
                        
                        <div className="w-full h-[58vh] border border-yellow-600/20 rounded-[2rem] bg-black/40 overflow-y-auto p-6 scrollbar-hide">
                            <table className="w-full border-collapse">
                                <tbody>
                                    {[ { name: "Amir", score: "99.8" }, { name: "Shadow", score: "84.2" }].map((res, i) => (
                                        <tr key={i} className="border-b border-yellow-600/10 last:border-0 h-28">
                                            <td className="text-5xl font-bold text-gray-200 text-right pr-8">{res.name}</td>
                                            <td className="text-5xl text-yellow-500 font-black text-left pl-8">{res.score}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <button onClick={() => setView('onboarding')} className="mt-12 py-10 px-16 border-b-4 border-yellow-600 text-4xl font-black text-yellow-600 uppercase tracking-widest active:scale-95 transition-all">{t.retry}</button>
                    </div>
                )}

                {/* الحكمة السفلية */}
                <div className="absolute bottom-20 w-full px-12 text-center pointer-events-none transition-all duration-1000" style={{ opacity: fade ? 1 : 0 }}>
                    <p className="spiritual-quote italic mb-4 leading-tight font-medium text-3xl md:text-5xl">{t.quotes[0].text}</p>
                    <p className="text-2xl text-yellow-600/40">— {t.quotes[0].author}</p>
                </div>
            </main>
        </div>
    );
}
