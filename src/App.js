import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, ChevronDown } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Your task is to analyze the user's entire personality, values, and cognitive patterns based on the provided 30-dimensional personality framework. Deeply process the user's previous inputs, linguistic nuances, and philosophical leanings. 

Output requirements:
1. Conduct a multi-layered analysis of the 30 dimensions.
2. Generate a precise 30-dimensional vector (values between 0-15).
3. Output ONLY the resulting Base64-encoded fingerprint string. No preamble, no explanation.`;

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: [
            "1. قم بنسخ البرومبت الكامل الموضح في الصندوق أدناه.",
            "2. توجه إلى أي ذكاء اصطناعي اعتاد الدردشة معك (Gemini, ChatGPT, Claude).",
            "3. امنحه البرومبت؛ وتذكر أنه كلما كثرت وزاد عمق حواراتكما، كلما كانت البصمة أدق في تمثيل شخصيتك الحقيقية.",
            "4. قم بنسخ البصمة المشفرة (Base64) التي سيولدها لك الذكاء الاصطناعي وألصقها في الحقل المخصص."
        ],
        input: "أدخل بصمتك الوجودية هنا...",
        match: "فك تشفير البصمة",
        resultsTitle: "الـصّـدَى الـوُجُـودِيّ",
        retry: "تحديث البصمة",
        quotes: [
            { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
            { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "الإمام علي بن أبي طالب" }
        ]
    },
    EN: {
        start: "START EXISTENTIAL JOURNEY",
        promptTitle: "Psychological Vector Prompt",
        guide: [
            "1. Copy the full prompt from the box below.",
            "2. Provide it to any AI you interact with regularly (Gemini, ChatGPT, etc.).",
            "3. Note: The deeper and more frequent your conversations, the more accurate the fingerprint.",
            "4. Copy the generated Base64 code and paste it here."
        ],
        input: "Paste your existential code here...",
        match: "DECODE FINGERPRINT",
        resultsTitle: "Existential Echo",
        retry: "Update Fingerprint",
        quotes: [{ text: "«My goal was only to live in accordance with the impulses that came from my true self.»", author: "Hermann Hesse" }]
    }
};

const Engine = {
    decode: (b64) => { 
        try { 
            const decoded = atob(b64.trim());
            return JSON.parse(decoded).map(v => (v - 7.5) / 7.5); 
        } catch (e) { return null; } 
    },
    calculate: (v1, v2) => {
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < 30; i++) { 
            dot += v1[i] * v2[i]; n1 += v1[i] * v1[i]; n2 += v2[i] * v2[i]; 
        }
        const sim = dot / (Math.sqrt(n1) * Math.sqrt(n2));
        return isNaN(sim) ? 0 : sim;
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

    const t = TRANSLATIONS[lang];

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => { 
                setQuoteIdx(p => (p + 1) % t.quotes.length); 
                setFade(true); 
            }, 1000);
        }, 12000);
        return () => clearInterval(interval);
    }, [t.quotes.length]);

    const handleMatch = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        try {
            const userVector = Engine.decode(userInput);
            if (!userVector) {
                alert(lang === 'AR' ? "تنسيق البصمة غير صالح" : "Invalid Fingerprint Format");
                setLoading(false);
                return;
            }

            const { data: users, error } = await supabase.from('profiles').select('username, vector_data');
            if (error) throw error;

            const scored = users.map(u => ({
                name: u.username,
                score: (Engine.calculate(userVector, u.vector_data) * 100).toFixed(2)
            })).filter(u => u.score > 0).sort((a, b) => b.score - a.score);

            setResults(scored);
            setView('results');
        } catch (e) {
            console.error(e);
            alert(lang === 'AR' ? "حدث خطأ في جلب البيانات" : "Data Fetching Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#020202] text-gray-300 font-serif flex flex-col overflow-hidden select-none">
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote { color: #ffd700; text-shadow: 0 0 25px rgba(212, 175, 55, 0.4); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            
            {music && <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" />}

            <header className="h-28 flex justify-between items-center px-10 z-[200]">
                <div className="flex items-center gap-12 scale-[1.7]">
                    <div className="relative">
                        <button onClick={() => setShowLang(!showLang)} className="text-yellow-600/70 border border-yellow-600/30 px-3 py-1 rounded-lg bg-black flex items-center gap-2">
                            <Globe size={14} /> <span className="text-[10px] font-bold">{lang}</span>
                        </button>
                        {showLang && (
                            <div className="absolute top-10 left-0 bg-black border border-yellow-600/40 rounded-xl w-28 overflow-hidden shadow-2xl z-[300]">
                                {['AR', 'EN'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-4 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer font-bold">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/50">{music ? <Volume2 /> : <VolumeX />}</button>
                </div>
            </header>

            <main className="flex-1 relative flex flex-col items-center w-full h-full">
                {view === 'landing' && (
                    <div className="absolute inset-0 flex flex-col items-center pt-[10vh]">
                        <div className="flex flex-col items-center" dir="ltr">
                            <div className="flex items-baseline gap-8">
                                <span className="text-[16rem] font-black gold-text leading-none">2</span>
                                <span className="text-[11rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-6xl tracking-[1.6em] text-yellow-500 uppercase font-black mr-[-1.6em]">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[88%] py-14 border-2 border-yellow-600/40 rounded-full text-5xl font-black text-yellow-500 uppercase active:scale-95 transition-all">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="absolute inset-0 flex flex-col items-center px-10 pt-4 space-y-8 overflow-y-auto scrollbar-hide pb-60">
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[3.5rem] p-10" dir="rtl">
                            <div className="flex justify-between items-center mb-8 border-b border-yellow-900/20 pb-6">
                                <span className="text-5xl font-bold text-yellow-500">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-6 bg-yellow-600 text-black rounded-3xl active:scale-90"><Copy size={38} /></button>
                            </div>
                            <div className="space-y-6 mb-10">
                                {t.guide.map((line, idx) => <p key={idx} className="text-3xl text-yellow-600 font-bold leading-snug text-right">{line}</p>)}
                            </div>
                            <div className="text-2xl text-white/5 italic font-sans max-h-24 overflow-hidden">{PROMPT_TEXT}</div>
                        </div>
                        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={t.input} dir="rtl" className="w-full h-56 bg-black/80 border border-yellow-900/30 rounded-[3rem] p-10 text-4xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none" />
                        <button onClick={handleMatch} className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-5xl uppercase shadow-2xl active:scale-95 transition-all">
                            {loading ? "..." : t.match}
                        </button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="absolute inset-0 flex flex-col items-center px-10 pt-4">
                        <h2 className="text-6xl font-bold gold-text mb-12 tracking-wide" dir="rtl">الـصّـدَى الـوُجُـودِيّ</h2>
                        <div className="w-full h-[58vh] border border-yellow-600/20 rounded-[2.5rem] bg-black/40 overflow-y-auto scrollbar-hide p-6">
                            <table className="w-full border-collapse" dir="rtl">
                                <tbody>
                                    {results.length > 0 ? results.map((res, i) => (
                                        <tr key={i} className="border-b border-yellow-600/10 last:border-0 h-28">
                                            <td className="text-5xl font-bold text-gray-200 text-right pr-8">{res.name}</td>
                                            <td className="text-5xl text-yellow-500 font-black text-left pl-8">{res.score}%</td>
                                        </tr>
                                    )) : (
                                        <tr><td className="text-3xl text-center py-20 text-yellow-600/50 italic">لا توجد تطابقات حقيقية بعد...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-12 py-10 px-16 border-b-4 border-yellow-600 text-4xl font-black text-yellow-600 uppercase tracking-widest active:opacity-50 transition-all">
                            {t.retry}
                        </button>
                    </div>
                )}

                <div className="absolute bottom-20 w-full px-12 text-center pointer-events-none transition-all duration-1000" style={{ opacity: fade ? 1 : 0 }}>
                    <p className="text-4xl md:text-5xl spiritual-quote italic mb-6 leading-tight font-medium" dir="rtl">
                        {t.quotes[quoteIdx].text}
                    </p>
                    <p className="text-2xl text-yellow-600/40" dir="rtl">— {t.quotes[quoteIdx].author}</p>
                </div>
            </main>
        </div>
    );
}
