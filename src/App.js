import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Music, Volume2, VolumeX, LogOut, Search, MessageSquare, RefreshCw, User, ShieldCheck, Copy, Check, Send } from 'lucide-react';

// إعداد Supabase
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
    ar: { name: "العربية", welcome: "مرحباً بك في الفضاء النفسي", start: "ابدأ الرحلة الوجودية", guest: "دخول كضيف", promptTitle: "برومبت البصمة", copy: "نسخ البرومبت", paste: "أدخل بصمتك هنا", find: "توائمي", back: "عودة", settings: "إعدادات" },
    en: { name: "English", welcome: "Welcome to the Psychic Space", start: "Begin Journey", guest: "Guest Login", promptTitle: "Fingerprint Prompt", copy: "Copy Prompt", paste: "Paste your fingerprint", find: "Find Twin", back: "Back", settings: "Settings" },
    fr: { name: "Français", welcome: "Bienvenue dans l'espace psychique", start: "Commencer", guest: "Invité", promptTitle: "Prompt d'empreinte", copy: "Copier", paste: "Collez votre empreinte", find: "Trouver mon jumeau", back: "Retour", settings: "Paramètres" },
    ru: { name: "Русский", welcome: "Добро пожаловать في العالم النفسي", start: "Начать путь", guest: "Гость", promptTitle: "Промпт отпечатка", copy: "Копировать", paste: "Вставьте ваш код", find: "Найти близнеца", back: "Назад", settings: "Настройки" }
};

const Engine = {
    decode: (base64) => {
        try {
            const decoded = atob(base64);
            const array = JSON.parse(decoded);
            // المنطق القطبي المحدث: (val - 7.5) / 7.5
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
    const [showLangGrid, setShowLangGrid] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const audioRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'));

    useEffect(() => {
        const qInterval = setInterval(() => setQuoteIdx(p => (p + 1) % QUOTES.length), 10000);
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
                    @keyframes gold-pulse { 0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.2); transform: scale(1); } 50% { text-shadow: 0 0 40px rgba(212,175,55,0.8), 0 0 70px rgba(212,175,55,0.4); transform: scale(1.02); } }
                    .gold-glow { animation: gold-pulse 4s ease-in-out infinite; }
                `}
            </style>

            <header className="z-50 p-6 flex justify-between items-center bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button onClick={() => setShowLangGrid(!showLangGrid)} className="text-yellow-600 hover:text-yellow-400 transition-all"><Globe size={22} /></button>
                        {showLangGrid && (
                            <div className="absolute top-10 left-0 bg-[#0a0a0a] border border-yellow-900/40 rounded-xl p-2 grid grid-cols-1 w-32 z-[60] shadow-2xl">
                                {Object.entries(LANGUAGES).map(([key, value]) => (
                                    <button key={key} onClick={() => {setLang(key); setShowLangGrid(false);}} className="p-2 text-[10px] hover:bg-yellow-900/20 text-left rounded"> {value.name} </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600 hover:text-yellow-400">
                        {music ? <Volume2 size={22} /> : <VolumeX size={22} />}
                    </button>
                </div>
                {view !== 'landing' && <button onClick={() => setView('landing')} className="text-red-900/40 hover:text-red-500"><LogOut size={22} /></button>}
            </header>

            <main className="flex-1 flex flex-col relative z-20">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-start pt-12 space-y-12">
                        <div className="text-center space-y-2 gold-glow">
                            <h1 className="text-[11rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none">2in</h1>
                            <p className="text-xs tracking-[0.8em] text-yellow-700 uppercase font-sans font-bold">Intellectual Twinning</p>
                        </div>

                        <div className="max-w-2xl text-center px-10 h-20 flex items-center justify-center">
                            <p className="text-lg text-yellow-500/60 italic leading-relaxed">{QUOTES[quoteIdx]}</p>
                        </div>

                        <button onClick={() => setView('onboarding')} className="mt-8 px-12 py-4 border border-yellow-600/30 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-widest uppercase text-sm">
                            {LANGUAGES[lang].start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="max-w-xl w-full bg-black/60 border border-yellow-900/20 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
                            <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-3"><ShieldCheck className="text-yellow-600"/> {LANGUAGES[lang].promptTitle}</h3>
                            <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-600/20 mb-6 group relative">
                                <pre className="text-[10px] text-yellow-700 whitespace-pre-wrap font-sans">
                                    {`You are a "Psychological Vector Engine". Generate a 30-dimensional personality vector (0.0 to 15.0). Output only the Base64 encoded JSON array.`}
                                </pre>
                                <button onClick={() => navigator.clipboard.writeText("Generate my 30D personality vector as a Base64 encoded JSON array.")} className="absolute top-4 right-4 p-2 bg-yellow-600/20 rounded-lg text-yellow-500 hover:bg-yellow-500 transition-all">
                                    <Copy size={14} />
                                </button>
                            </div>
                            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={LANGUAGES[lang].paste} className="w-full h-40 bg-black/40 border border-yellow-900/30 rounded-2xl p-5 text-yellow-100 font-mono text-xs focus:ring-1 focus:ring-yellow-500 outline-none" />
                            <button onClick={handleMatch} className="w-full mt-6 py-5 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-800 text-black font-black rounded-2xl tracking-widest uppercase">
                                {loading ? "..." : LANGUAGES[lang].find}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'matches' && (
                    <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4 overflow-y-auto max-h-[70vh] pr-2">
                            {results.map(u => (
                                <div key={u.id} onClick={() => setActiveChat(u)} className={`p-6 rounded-3xl border transition-all cursor-pointer ${activeChat?.id === u.id ? 'bg-yellow-900/20 border-yellow-500 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/5 hover:border-yellow-900/30'}`} >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-300">{u.name}</span>
                                        <span className="text-[10px] bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded-full">{u.score}%</span>
                                    </div>
                                    <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                                        <div className="bg-yellow-600 h-full transition-all duration-1000" style={{width: `${u.score}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-2 bg-black/40 border border-yellow-900/10 rounded-[3rem] flex flex-col relative overflow-hidden">
                            {activeChat ? (
                                <div className="flex-1 flex flex-col h-full">
                                    <div className="p-6 border-b border-yellow-900/10 flex items-center gap-4 bg-yellow-900/5">
                                        <div className="w-10 h-10 rounded-full bg-yellow-700 flex items-center justify-center text-black font-bold">{activeChat.name[0]}</div>
                                        <div><p className="text-yellow-500 font-bold">{activeChat.name}</p><p className="text-[10px] text-green-700 animate-pulse uppercase tracking-tighter">Active Connection</p></div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-12 text-center">
                                        <p className="text-gray-600 italic">"الصمت هنا لغة الأرواح."</p>
                                    </div>
                                    <div className="p-6 bg-black/60 flex gap-4">
                                        <input type="text" placeholder="اكتب رسالتك الوجودية..." className="flex-1 bg-white/5 border border-yellow-900/20 rounded-full px-6 py-3 text-sm outline-none" />
                                        <button className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all"><Send size={18} /></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-700 uppercase tracking-widest text-xs">اختر كياناً لتبدأ الحوار</div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
