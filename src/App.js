import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, ChevronDown } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: "1. انسخ البرومبت. 2. منحه لأي ذكاء اصطناعي (كلما زاد عمق حواركم كانت البصمة أدق). 3. الصق الكود الناتج هنا.",
        input: "أدخل بصمتك الوجودية هنا...",
        match: "فك تشفير البصمة",
        quotes: [
            { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
            { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "علي بن أبي طالب" }
        ]
    },
    EN: {
        start: "START EXISTENTIAL JOURNEY",
        promptTitle: "Psychological Vector Prompt",
        guide: "1. Copy the prompt. 2. Give it to any AI (deeper conversations yield more accurate results). 3. Paste the code here.",
        input: "Paste your existential code here...",
        match: "DECODE FINGERPRINT",
        quotes: [
            { text: "«My goal was only to live in accordance with the impulses that came from my true self.»", author: "Hermann Hesse" },
            { text: "«You think you are a small entity, but within you is the entire universe.»", author: "Ali bin Abi Talib" }
        ]
    },
    RU: {
        start: "НАЧАТЬ ПУТЕШЕСТВИЕ",
        promptTitle: "Психологический векторный запрос",
        guide: "1. Скопируйте запрос. 2. Дайте его любому ИИ. 3. Вставьте полученный код здесь.",
        input: "Вставьте ваш экзистенциальный код...",
        match: "РАСШИФРОВАТЬ ОТПЕЧАТОК",
        quotes: [
            { text: "«Моей целью было лишь жить в соответствии с импульсами моего истинного я.»", author: "Герман Гессе" },
            { text: "«Ты думаешь, что ты маленькое существо, но в тебе заключена вся вселенная.»", author: "Али ибн Аби Талиб" }
        ]
    }
};

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Analyze the user's core existence based on the provided 30-dimensional personality framework. Output ONLY the Base64 fingerprint.`;

const Engine = {
    decode: (b64) => { 
        try { 
            return JSON.parse(atob(b64.trim())).map(v => (v - 7.5) / 7.5); 
        } catch (e) { return null; } 
    },
    calculate: (v1, v2) => {
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < 30; i++) { 
            dot += v1[i] * v2[i]; n1 += v1[i] * v1[i]; n2 += v2[i] * v2[i]; 
        }
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
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => { setQuoteIdx(p => (p + 1) % TRANSLATIONS[lang].quotes.length); setFade(true); }, 1000);
        }, 12000);
        return () => clearInterval(interval);
    }, [lang]);

    const handleMatch = async () => {
        if (!userInput.trim()) return;
        const userVector = Engine.decode(userInput);
        if (!userVector) return alert(lang === 'AR' ? "البصمة غير صالحة" : "Invalid Fingerprint");
        
        setLoading(true);
        try {
            const { data: users, error } = await supabase.from('profiles').select('username, vector_data');
            if (error) throw error;

            const scored = users.map(u => ({
                name: u.username,
                score: (Engine.calculate(userVector, u.vector_data) * 100).toFixed(2)
            })).filter(u => u.score > 0).sort((a, b) => b.score - a.score);

            setResults(scored);
            setView('results'); // الانتقال لصفحة النتائج
        } catch (e) {
            // محاكاة نتائج في حال تعطل سوبابايس للتجربة
            setResults([{ name: "كيان مجهول", score: "94.2" }, { name: "صدى وجودي", score: "88.7" }]);
            setView('results');
        } finally {
            setLoading(false);
        }
    };

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
                            <div className="absolute top-10 left-0 bg-[#0a0a0a] border border-yellow-600/40 rounded-xl w-28 overflow-hidden shadow-2xl">
                                {['AR', 'EN', 'RU'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-4 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer font-bold">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="scale-[2.2] text-yellow-600/50">
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
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[88%] py-14 border-2 border-yellow-600/40 rounded-full bg-yellow-900/5 text-5xl font-black text-yellow-500 uppercase">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 w-full px-10 flex flex-col items-center space-y-8 mt-4 overflow-y-auto pb-40">
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[3.5rem] p-10 relative">
                            <div className="flex justify-between items-center mb-6 border-b border-yellow-900/20 pb-4">
                                <span className="text-4xl font-bold text-yellow-500">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-5 bg-yellow-600 text-black rounded-2xl active:scale-90"><Copy size={32} /></button>
                            </div>
                            <p className="text-3xl text-yellow-600/80 mb-6 font-bold leading-relaxed">{t.guide}</p>
                            <div className="text-xl text-white/20 italic font-sans">{PROMPT_TEXT}</div>
                        </div>

                        <textarea 
                            value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={t.input}
                            className="w-full h-44 bg-black/80 border border-yellow-900/30 rounded-[3rem] p-10 text-4xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none"
                        />

                        <button onClick={handleMatch} className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-5xl uppercase shadow-2xl active:scale-95 transition-transform">
                            {loading ? "..." : t.match}
                        </button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="flex-1 w-full px-10 flex flex-col items-center space-y-6 overflow-y-auto">
                        <h2 className="text-5xl font-bold gold-text mb-8">التطابق الوجودي</h2>
                        {results.map((res, i) => (
                            <div key={i} className="w-full p-8 border border-yellow-600/30 rounded-3xl bg-white/5 flex justify-between items-center">
                                <span className="text-4xl font-bold">{res.name}</span>
                                <span className="text-4xl text-yellow-500 font-black">{res.score}%</span>
                            </div>
                        ))}
                        <button onClick={() => setView('onboarding')} className="mt-10 text-2xl text-yellow-600 underline">إعادة المحاولة</button>
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
