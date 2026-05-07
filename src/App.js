import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, LogOut, Copy, Globe, ChevronDown } from 'lucide-react';

// --- الربط مع سوبابايس (لا يُمس) ---
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const QUOTES = [
    { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
    { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "علي بن أبي طالب" },
    { text: "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.»", author: "جلال الدين الرومي" }
];

const TRANSLATIONS = {
    AR: { start: "ابدأ الرحلة الوجودية", prompt: "برومبت البصمة", input: "أدخل بصمتك الوجودية هنا...", match: "توائمي" },
    EN: { start: "Start Journey", prompt: "Vector Prompt", input: "Paste your vector here...", match: "Find Twins" }
};

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Analyze the user's core existence based on the provided 30-dimensional personality framework. Output ONLY the Base64 fingerprint.`;

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
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [showLang, setShowLang] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => { setQuoteIdx(p => (p + 1) % QUOTES.length); setFade(true); }, 1000);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    const t = TRANSLATIONS[lang];

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden">
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote { color: #ffd700; text-shadow: 0 0 25px rgba(212, 175, 55, 0.4); }
                .quote-container { transition: all 1.5s ease-in-out; opacity: ${fade ? 1 : 0}; }
            `}</style>

            {/* رابط الموسيقى الكونية الصافية */}
            {music && (
                <audio autoPlay loop>
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" type="audio/mpeg" />
                </audio>
            )}

            {/* Header: أزرار ضخمة (لغة + موسيقى) */}
            <header className="h-28 flex justify-between items-center px-10 z-[200]">
                <div className="flex items-center gap-12">
                    <div className="relative">
                        <button onClick={() => setShowLang(!showLang)} className="scale-[1.7] text-yellow-600/70 border border-yellow-600/30 px-3 py-1 rounded-lg bg-black flex items-center gap-1">
                            <Globe size={14} /> <span className="text-[10px]">{lang}</span> <ChevronDown size={10} />
                        </button>
                        {showLang && (
                            <div className="absolute top-14 left-0 bg-[#0a0a0a] border border-yellow-600/40 rounded-xl w-36 overflow-hidden shadow-2xl">
                                {['AR', 'EN'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-5 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer text-xl">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="scale-[2.0] text-yellow-600/50">
                        {music ? <Volume2 /> : <VolumeX />}
                    </button>
                </div>
            </header>

            <main className="flex-1 relative z-50 flex flex-col items-center">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center w-full">
                        <div className="mt-[12vh] flex flex-col items-center">
                            <div className="flex items-baseline gap-8">
                                <span className="text-[16rem] font-black gold-text leading-none">2</span>
                                <span className="text-[11rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-6xl tracking-[1.6em] text-yellow-500 uppercase font-black mr-[-1.6em]">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[88%] py-14 border-2 border-yellow-600/40 rounded-full bg-yellow-900/5 text-5xl font-black text-yellow-500 uppercase tracking-widest active:scale-95 transition-all">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 w-full px-10 flex flex-col items-center space-y-10 mt-6">
                        {/* استعادة البرومبت بحجم كبير وزر نسخ */}
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[4rem] p-10 relative">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-3xl font-bold text-yellow-500">{t.prompt}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-4 bg-yellow-600/10 rounded-2xl scale-125"><Copy size={24} /></button>
                            </div>
                            <div className="text-xl text-yellow-800/50 leading-relaxed font-sans max-h-32 overflow-hidden italic">
                                {PROMPT_TEXT}
                            </div>
                        </div>

                        {/* خانة البصمة وظيفية */}
                        <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t.input}
                            className="w-full h-48 bg-black/80 border border-yellow-900/30 rounded-[3rem] p-10 text-3xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none shadow-inner"
                        />

                        {/* زر توائمي ضخم */}
                        <button className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-5xl uppercase tracking-tighter shadow-2xl active:scale-95 transition-transform">
                            {t.match}
                        </button>
                    </div>
                )}

                {/* سطر الحكم: تكبير بنسبة 70% كما طلبت */}
                <div className="absolute bottom-24 w-full px-12 text-center quote-container pointer-events-none">
                    <p className="text-4xl md:text-5xl spiritual-quote italic mb-6 leading-tight">
                        {QUOTES[quoteIdx].text}
                    </p>
                    <p className="text-2xl text-yellow-600/40 font-light">— {QUOTES[quoteIdx].author}</p>
                </div>
            </main>
        </div>
    );
}
