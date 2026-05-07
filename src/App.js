import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, ChevronDown } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Analyze the user's core existence based on the provided 30-dimensional personality framework. Output ONLY the Base64 fingerprint.`;

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: [
            "1. انسخ البرومبت من الصندوق أدناه.",
            "2. امنحه لأي ذكاء اصطناعي (مثل Gemini).",
            "3. الصق كود Base64 الناتج هنا."
        ],
        input: "...أدخل بصمتك الوجودية هنا",
        match: "فك تشفير البصمة",
        resultsTitle: "الـصّـدَى الـوُجُـودِيّ",
        retry: "تحديث البصمة",
        quotes: [{ text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" }]
    }
};

export default function App() {
    const [view, setView] = useState('landing');
    const [lang, setLang] = useState('AR');
    const [music, setMusic] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [showLang, setShowLang] = useState(false);
    const [loading, setLoading] = useState(false);

    const t = TRANSLATIONS[lang];

    return (
        <div className="fixed inset-0 w-full h-full bg-[#020202] text-gray-300 font-serif flex flex-col overflow-hidden select-none">
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote { color: #ffd700; text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); line-height: 1.6; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            
            {music && <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" />}

            {/* Header - ثابت لا يتغير */}
            <header className="h-24 flex justify-between items-center px-8 z-[100]">
                <div className="flex items-center gap-10 scale-[1.5]">
                    <div className="relative">
                        <button onClick={() => setShowLang(!showLang)} className="text-yellow-600/70 border border-yellow-600/30 px-3 py-1 rounded-lg bg-black flex items-center gap-2">
                            <Globe size={12} /> <span className="text-[10px] font-bold">{lang}</span>
                        </button>
                        {showLang && (
                            <div className="absolute top-10 left-0 bg-black border border-yellow-600/40 rounded-xl w-24 overflow-hidden shadow-2xl z-[200]">
                                {['AR', 'EN', 'RU'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-3 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer font-bold text-xs">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/50">{music ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center relative w-full h-full">
                {view === 'landing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-start pt-[10vh] animate-in fade-in duration-700">
                        {/* تصحيح الانعكاس: محاذاة يسارية إجبارية للشعار */}
                        <div className="flex flex-col items-center" dir="ltr">
                            <div className="flex items-baseline gap-6">
                                <span className="text-[14rem] font-black gold-text leading-none">2</span>
                                <span className="text-[10rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-5xl tracking-[1.4em] text-yellow-500 uppercase font-black mr-[-1.4em]">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[85%] py-12 border-2 border-yellow-600/40 rounded-full text-4xl font-black text-yellow-500 uppercase shadow-[0_0_30px_rgba(180,130,0,0.1)] active:scale-95 transition-all">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="absolute inset-0 flex flex-col items-center px-8 pt-4 space-y-6 overflow-y-auto scrollbar-hide pb-40 animate-in slide-in-from-bottom duration-500">
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[2.5rem] p-8" dir="rtl">
                            <div className="flex justify-between items-center mb-6 border-b border-yellow-900/20 pb-4">
                                <span className="text-4xl font-bold text-yellow-500">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-4 bg-yellow-600 text-black rounded-2xl active:scale-90"><Copy size={24} /></button>
                            </div>
                            <div className="space-y-4 mb-6">
                                {t.guide.map((line, idx) => <p key={idx} className="text-2xl text-yellow-600/90 font-bold leading-snug">{line}</p>)}
                            </div>
                        </div>

                        <textarea 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)} 
                            placeholder={t.input} 
                            dir="rtl"
                            className="w-full h-48 bg-black border border-yellow-900/30 rounded-[2rem] p-8 text-3xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none" 
                        />

                        <button onClick={() => setView('results')} className="w-full py-10 bg-yellow-600 text-black font-black rounded-full text-4xl uppercase shadow-2xl active:scale-95">
                            {loading ? "..." : t.match}
                        </button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="absolute inset-0 flex flex-col items-center px-8 pt-4 animate-in fade-in duration-1000">
                        <h2 className="text-5xl font-bold gold-text mb-8 tracking-wide" dir="rtl">الـصّـدَى الـوُجُـودِيّ</h2>
                        
                        {/* الجدول المستطيل الرفيع بنسبة 60% */}
                        <div className="w-full h-[55vh] border border-yellow-600/20 rounded-[1.5rem] bg-black/40 overflow-y-auto scrollbar-hide p-4">
                            <table className="w-full border-collapse" dir="rtl">
                                <tbody>
                                    {[ { name: "Amir", score: "99.8" }, { name: "Shadow", score: "84.2" }].map((res, i) => (
                                        <tr key={i} className="border-b border-yellow-600/10 last:border-0 h-24">
                                            <td className="text-4xl font-bold text-gray-200 text-right pr-4">{res.name}</td>
                                            <td className="text-4xl text-yellow-500 font-black text-left pl-4">{res.score}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <button onClick={() => setView('onboarding')} className="mt-8 py-6 px-12 border-b-2 border-yellow-600 text-2xl font-black text-yellow-600 uppercase tracking-widest active:opacity-50">
                            {t.retry}
                        </button>
                    </div>
                )}

                {/* الحكمة السفلية - ثابتة ومحسنة لغوياً */}
                <div className="absolute bottom-16 w-full px-10 text-center pointer-events-none transition-opacity duration-1000">
                    <p className="spiritual-quote italic mb-3 text-2xl md:text-4xl font-medium" dir="rtl">
                        {t.quotes[0].text}
                    </p>
                    <p className="text-xl text-yellow-600/40" dir="rtl">— {t.quotes[0].author}</p>
                </div>
            </main>
        </div>
    );
}
