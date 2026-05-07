import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Music, Volume2, VolumeX, LogOut, Search, MessageSquare, RefreshCw, User, ShieldCheck, Copy, Check, Send } from 'lucide-react';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const QUOTES = [
    "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بهذه الصعوبة؟» - هيرمان هيسه",
    "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.» - علي بن أبي طالب",
    "«من ينظر إلى الخارج يحلم، ومن ينظر إلى الداخل يستيقظ.» - كارل يونغ",
    "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.» - جلال الدين الرومي",
    "«من يعرف الآخرين فهو عالم، ومن يعرف نفسه فهو حكيم.» - لاوتسو"
];

const LANGUAGES = {
    ar: { welcome: "مرحباً بك في الفضاء النفسي", start: "ابدأ الرحلة الوجودية", paste: "أدخل بصمة الروح (Base64)", find: "تحليل التطابق", loading: "جاري فك التشفير..." },
    en: { welcome: "Welcome to the Psychic Space", start: "Begin Existential Journey", paste: "Paste Soul Fingerprint", find: "Analyze Twinning", loading: "Decoding Vector..." }
};

const Engine = {
    decode: (base64) => {
        try {
            const decoded = atob(base64);
            const array = JSON.parse(decoded);
            // تحويل من (0 إلى 15) إلى ميزان قطبي (-1 إلى +1)
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

export default function TwoIn() {
    const [lang, setLang] = useState('ar');
    const [view, setView] = useState('landing');
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const audioRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'));

    useEffect(() => {
        const qInterval = setInterval(() => setQuoteIdx(p => (p + 1) % QUOTES.length), 10000);
        return () => clearInterval(qInterval);
    }, []);

    useEffect(() => {
        music ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
        audioRef.current.loop = true;
    }, [music]);

    const handleMatch = async () => {
        const vec = Engine.decode(userInput);
        if (!vec) return alert("الشيفرة غير صالحة. تأكد من نسخ النص المشفر فقط.");
        setLoading(true);
        setView('matches');
        try {
            const { data: users } = await supabase.from('profiles').select('id, username, vector_data');
            const scored = (users || []).map(u => ({
                id: u.id,
                name: u.username,
                score: (Engine.calculateSimilarity(vec, u.vector_data) * 100).toFixed(2)
            })).filter(u => u.score > 0).sort((a, b) => b.score - a.score);
            setResults(scored);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-gray-300 font-serif overflow-hidden flex flex-col relative">
            <style>
                {`
                    @keyframes gold-pulse { 
                        0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.2); transform: scale(1); }
                        50% { text-shadow: 0 0 40px rgba(212,175,55,0.8), 0 0 70px rgba(212,175,55,0.4); transform: scale(1.02); }
                    }
                    .animate-gold { animation: gold-pulse 4s ease-in-out infinite; }
                    .bg-mesh { background-image: radial-gradient(at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 50%); }
                `}
            </style>

            <div className="absolute inset-0 bg-mesh pointer-events-none" />

            {/* Header ثابت لجميع الواجهات */}
            <header className="z-50 p-6 flex justify-between items-center">
                <button onClick={() => setMusic(!music)} className="text-yellow-600/50 hover:text-yellow-400 transition-all">
                    {music ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                {view !== 'landing' && (
                    <button onClick={() => setView('landing')} className="text-yellow-900/40 hover:text-red-500 transition-all">
                        <LogOut size={20} />
                    </button>
                )}
            </header>

            <main className="flex-1 flex flex-col relative z-20">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-start pt-12 space-y-12">
                        {/* العنوان الكبير المشع في الوسط العلوي */}
                        <div className="text-center space-y-4 animate-gold">
                            <h1 className="text-[12rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none">
                                2in
                            </h1>
                            <p className="text-xs tracking-[1em] text-yellow-700 uppercase font-sans font-bold">
                                Intellectual Twinning
                            </p>
                        </div>

                        <div className="max-w-2xl text-center px-10 h-24 flex items-center">
                            <p className="text-lg text-yellow-500/60 italic transition-opacity duration-1000">
                                {QUOTES[quoteIdx]}
                            </p>
                        </div>

                        <button 
                            onClick={() => setView('onboarding')}
                            className="mt-12 px-16 py-4 border border-yellow-600/30 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-[0.2em] text-sm uppercase"
                        >
                            {LANGUAGES[lang].start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="max-w-xl w-full bg-black/60 border border-yellow-900/20 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
