import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, ChevronDown } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: "1. انسخ البرومبت أدناه. 2. منحه لـ ChatGPT. 3. الصق البصمة الناتجة هنا.",
        input: "أدخل بصمتك الوجودية هنا...",
        match: "توائمي",
        quotes: [
            { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
            { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "علي بن أبي طالب" }
        ]
    },
    EN: {
        start: "START EXISTENTIAL JOURNEY",
        promptTitle: "Psychological Vector Prompt",
        guide: "1. Copy the prompt. 2. Give it to ChatGPT. 3. Paste the generated code here.",
        input: "Paste your existential code here...",
        match: "FIND TWINS",
        quotes: [
            { text: "«My goal was only to live in accordance with the impulses that came from my true self.»", author: "Hermann Hesse" },
            { text: "«You think you are a small entity, but within you is the entire universe.»", author: "Ali bin Abi Talib" }
        ]
    },
    RU: {
        start: "НАЧАТЬ ПУТЕШЕСТВИЕ",
        promptTitle: "Психологический векторный запрос",
        guide: "1. Скопируйте запрос. 2. Дайте его ChatGPT. 3. Вставьте код здесь.",
        input: "Вставьте ваш экзистенциальный код...",
        match: "НАЙТИ БЛИЗНЕЦОВ",
        quotes: [
            { text: "«Моей целью было лишь жить в соответствии с импульсами моего истинного я.»", author: "Герман Гессе" },
            { text: "«Ты думаешь, что ты маленькое существо, но в тебе заключена вся вселенная.»", author: "Али ибн Аби Талиб" }
        ]
    }
};

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Analyze the user's core existence based on the provided 30-dimensional personality framework. Output ONLY the Base64 fingerprint.`;

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
            setTimeout(() => { setQuoteIdx(p => (p + 1) % TRANSLATIONS[lang].quotes.length); setFade(true); }, 1000);
        }, 12000);
        return () => clearInterval(interval);
    }, [lang]);

    const t = TRANSLATIONS[lang];

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden">
            <style>{`.gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } .spiritual-quote { color: #ffd700; text-shadow: 0 0 25px rgba(212, 175, 55, 0.4); }`}</style>

            {music && <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" />}

            <header className="h-28 flex justify-between items-center px-10 z-[200]">
                <div className="flex items-center gap-12">
                    <div className="relative scale-[1.7]">
                        <button onClick={() => setShowLang(!showLang)} className="text-yellow-600/70 border border-yellow-600/30 px-3 py-1 rounded-lg bg-black flex items-center gap-2">
                            <Globe size={14} /> <span className="text-[10px] font-bold">{lang}</span> <ChevronDown size={10} />
                        </button>
                        {showLang && (
                            <div className="absolute top-10 left-0 bg-[#0a0a0a] border border-yellow-600/40 rounded-xl w-28 overflow-hidden shadow-2xl z-[300]">
                                {['AR', 'EN', 'RU'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-4 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer font-bold">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="scale-[2.2] text-yellow-600/50 ml-4">
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
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[88%] py-14 border-2 border-yellow-600/40 rounded-full bg-yellow-900/5 text-5xl font-black text-yellow-500 tracking-widest active:scale-95 transition-all uppercase">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 w-full px-10 flex flex-col items-center space-y-8 mt-4 overflow-y-auto pb-40">
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[3.5rem] p-10 relative">
                            <div className="flex justify-between items-center mb-6 border-b border-yellow-900/20 pb-4">
                                <span className="text-4xl font-bold text-yellow-500">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-5 bg-yellow-600 text-black rounded-2xl active:scale-90 transition-transform"><Copy size={32} /></button>
                            </div>
                            <p className="text-2xl text-yellow-600/70 mb-6 font-bold leading-relaxed">{t.guide}</p>
                            <div className="text-xl text-white/30 italic font-sans">{PROMPT_TEXT}</div>
                        </div>

                        <textarea 
                            value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={t.input}
                            className="w-full h-44 bg-black/80 border border-yellow-900/30 rounded-[3rem] p-10 text-4xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none"
                        />

                        <button className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-5xl uppercase shadow-2xl active:scale-95 transition-transform">
                            {t.match}
                        </button>
                    </div>
                )}

                <div className="absolute bottom-24 w-full px-12 text-center pointer-events-none transition-all duration-1000" style={{ opacity: fade ? 1 : 0 }}>
                    <p className="text-4xl md:text-5xl spiritual-quote italic mb-6 leading-tight font-medium">
                        {t.quotes[quoteIdx].text}
                    </p>
                    <p className="text-2xl text-yellow-600/40 font-light">— {t.quotes[quoteIdx].author}</p>
                </div>
            </main>
        </div>
    );
}
