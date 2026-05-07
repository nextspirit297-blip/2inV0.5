import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Volume2, VolumeX, LogOut, ShieldCheck, Copy, Send, MessageSquare, Image as ImageIcon, Mic, ChevronLeft } from 'lucide-react';

// إعداد Supabase - تأكد من مطابقة هذه القيم لبيئة مشروعك
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const QUOTES = [
    "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بهذه الصعوبة؟» - هيرمان هيسه",
    "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.» - علي بن أبي طالب",
    "«من ينظر إلى الخارج يحلم، ومن ينظر إلى الداخل يستيقظ.» - كارل يونغ",
    "«معرفة نفسك هي بداية كل حكمة.» - أرسطو",
    "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.» - جلال الدين الرومي",
    "«من يعرف الآخرين فهو عالم، ومن يعرف نفسه فهو حكيم.» - لاوتسو",
    "«اعرف نفسك بنفسك» - سقراط"
];

const LANGUAGES = {
    ar: { start: "ابدأ الرحلة الوجودية", promptTitle: "برومبت البصمة", paste: "أدخل بصمتك هنا", find: "توائمي", chatTitle: "المحادثات الوجودية" },
    en: { start: "Begin Journey", promptTitle: "Fingerprint Prompt", paste: "Paste your fingerprint", find: "Find Twin", chatTitle: "Existential Chats" }
};

const Engine = {
    decode: (base64) => {
        try {
            const decoded = atob(base64);
            const array = JSON.parse(decoded);
            return array.map(val => (val - 7.5) / 7.5);
        } catch (e) { return null; }
    },
    calculateSimilarity: (v1, v2) => {
        if (!v1 || !v2) return 0;
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < 30; i++) {
            dot += v1[i] * v2[i];
            n1 += v1[i] * v1[i];
            n2 += v2[i] * v2[i];
        }
        const sim = dot / (Math.sqrt(n1) * Math.sqrt(n2));
        return isNaN(sim) ? 0 : sim;
    }
};

export default function App() {
    const [lang, setLang] = useState('ar');
    const [view, setView] = useState('landing');
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const audioRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'));

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

    useEffect(() => {
        if (music) { audioRef.current.play().catch(() => {}); } 
        else { audioRef.current.pause(); }
        audioRef.current.loop = true;
    }, [music]);

    const handleMatch = async () => {
        const vec = Engine.decode(userInput);
        if (!vec) return alert("الشيفرة غير صالحة.");
        setLoading(true);
        // محاكاة جلب البيانات من السوبا بيس (سيتم تفعيل المنطق الحقيقي لاحقاً)
        setTimeout(() => {
            setResults([...Array(10)].map((_, i) => ({ id: i, name: `كيان ${i+1}`, score: 99 - i })));
            setView('main');
            setLoading(false);
        }, 1500);
    };

    const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine."...`;

    return (
        <div className="min-h-screen bg-[#020202] text-gray-300 font-serif overflow-hidden flex flex-col relative">
            <style>
                {`
                    @keyframes gold-pulse { 0%, 100% { text-shadow: 0 0 50px rgba(212,175,55,0.7); transform: scale(1); } 50% { text-shadow: 0 0 80px rgba(212,175,55,1); transform: scale(1.03); } }
                    .gold-glow { animation: gold-pulse 4s ease-in-out infinite; }
                    .quote-fade { transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out; opacity: ${fade ? 0.7 : 0}; transform: translateY(${fade ? '0' : '30px'}); }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a3712; border-radius: 10px; }
                `}
            </style>

            {/* Header */}
            <header className="z-50 p-8 flex justify-between items-center relative h-32">
                <div className="flex items-center gap-10">
                    {view !== 'landing' && (
                        <div className="flex flex-col items-start leading-none select-none">
                            <span className="text-6xl font-black text-yellow-500 tracking-tighter">2in</span>
                            <span className="text-[12px] text-yellow-700 tracking-[0.5em] uppercase font-sans font-bold">twin</span>
                        </div>
                    )}
                    <button onClick={() => setMusic(!music)} className="text-yellow-600 hover:text-yellow-400">
                        {music ? <Volume2 size={36} /> : <VolumeX size={36} />}
                    </button>
                </div>
                {view !== 'landing' && <button onClick={() => setView('landing')} className="text-red-900/40 hover:text-red-500"><LogOut size={36} /></button>}
            </header>

            <main className="flex-1 flex flex-col relative z-20 overflow-y-auto custom-scrollbar">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-between py-12">
                        <div className="text-center space-y-8 gold-glow mt-10">
                            <h1 className="text-[18rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none">2in</h1>
                            <p className="text-[36px] tracking-[2em] text-yellow-700 uppercase font-sans font-bold ml-[2em]">twin</p>
                        </div>
                        <div className="mb-[10vh]">
                            <button onClick={() => setView('onboarding')} className="px-36 py-14 border-2 border-yellow-600/40 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-[0.5em] uppercase text-5xl font-black shadow-[0_0_80px_rgba(212,175,55,0.3)]">
                                {LANGUAGES[lang].start}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 flex items-center justify-center p-6 mb-[15vh]">
                        <div className="max-w-4xl w-full bg-black/80 border border-yellow-900/20 p-20 rounded-[5rem] shadow-2xl">
                            <h3 className="text-5xl text-yellow-500 mb-10 font-bold">{LANGUAGES[lang].promptTitle}</h3>
                            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={LANGUAGES[lang].paste} className="w-full h-80 bg-black/40 border border-yellow-900/30 rounded-[3rem] p-12 text-yellow-100 text-2xl focus:ring-2 focus:ring-yellow-500 outline-none" />
                            <button onClick={handleMatch} className="w-full mt-10 py-10 bg-yellow-600 text-black font-black rounded-[3rem] text-4xl uppercase tracking-[0.3em]">
                                {loading ? "جاري التزامن..." : LANGUAGES[lang].find}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'main' && (
                    <div className="flex-1 flex flex-col items-center px-10 pb-[25vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
                            {results.map((u) => (
                                <div key={u.id} className="bg-white/5 border border-yellow-900/20 p-8 rounded-[3rem] flex justify-between items-center hover:border-yellow-500 transition-all">
                                    <div>
                                        <h4 className="text-3xl font-bold text-gray-200">{u.name}</h4>
                                        <p className="text-yellow-700 font-sans mt-2">توافق بنسبة {u.score}% • كيان متصل</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-yellow-900/20 border border-yellow-600/30 flex items-center justify-center text-yellow-600 font-black">?</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setView('messages')} className="fixed right-12 top-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-600 text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] z-50"><MessageSquare size={40} /></button>
                    </div>
                )}

                {view === 'messages' && (
                    <div className="flex-1 flex flex-col px-10 pb-[25vh]">
                        <div className="flex items-center gap-6 mb-8">
                            <button onClick={() => setView('main')} className="text-yellow-600 hover:text-yellow-400"><ChevronLeft size={48} /></button>
                            <h2 className="text-5xl font-black text-yellow-500 uppercase tracking-widest">{LANGUAGES[lang].chatTitle}</h2>
                        </div>
                        <div className="flex-1 bg-black/40 border border-yellow-900/10 rounded-[4rem] flex flex-col overflow-hidden relative">
                             <div className="flex-1 p-10 overflow-y-auto custom-scrollbar italic text-gray-700 text-center flex items-center justify-center text-3xl">اختر توأماً لكسر حاجز الصمت</div>
                             <div className="p-10 bg-[#0a0a0a] border-t border-yellow-900/20 flex items-center gap-6">
                                <button className="text-yellow-600"><ImageIcon size={32} /></button>
                                <input type="text" placeholder="تحدث..." className="flex-1 bg-transparent border-none outline-none text-2xl text-yellow-100" />
                                <button className="text-yellow-600"><Mic size={32} /></button>
                                <button className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center text-black"><Send size={36} /></button>
                             </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="fixed bottom-0 left-0 w-full h-[30vh] flex items-center justify-center z-10 pointer-events-none">
                <div className="mb-[15vh] px-12 text-center">
                    <p className="max-w-[80rem] text-4xl md:text-6xl text-yellow-600/30 italic quote-fade font-light">{QUOTES[quoteIdx]}</p>
                </div>
            </footer>
        </div>
    );
}
