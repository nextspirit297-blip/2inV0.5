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
    const [fade, setFade] = useState(true); // حالة الـ Fade
    const [userInput, setUserInput] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [showLangGrid, setShowLangGrid] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const audioRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'));

    useEffect(() => {
        const qInterval = setInterval(() => {
            setFade(false); // ابدأ بالاختفاء
            setTimeout(() => {
                setQuoteIdx(p => (p + 1) % QUOTES.length);
                setFade(true); // ابدأ بالظهور
            }, 1000); // وقت الاختفاء قبل التغيير
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

    const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Strip away all flattery and social bias for clinical accuracy. Generate a 30-dimensional personality vector (0.0 to 15.0) based on these polarities: 1.Nihilism/Meaning, 2.Logic/Intuition, 3.Stoicism/Empathy, 4.Solitude/Belonging, 5.Material/Spiritual, 6.Chaos/Order, 7.Skeptic/Faith, 8.Rebel/Conformist, 9.Nostalgia/Future, 10.Ego/Altruism, 11.Aesthetic/Utility, 12.Moral/Ethics, 13.Fear/Acceptance, 14.Power/Peace, 15.Science/Mystic, 16.Risk/Security, 17.Vulnerability/Control, 18.Arrogance/Humility, 19.Attachment/Freedom, 20.Silence/Noise, 21.Complexity/Simplicity, 22.Ambition/Observation, 23.Cynic/Romantic, 24.Reality/Delusion, 25.Vitality/Decay, 26.Collective/Individual, 27.Curiosity/Saturation, 28.Forgive/Grudge, 29.Validation/Sovereignty, 30.Depth/Surface. Output ONLY the raw Base64 encoded JSON array.`;

    return (
        <div className="min-h-screen bg-[#020202] text-gray-300 font-serif overflow-hidden flex flex-col relative">
            <style>
                {`
                    @keyframes gold-pulse { 0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.2); transform: scale(1); } 50% { text-shadow: 0 0 40px rgba(212,175,55,0.8), 0 0 70px rgba(212,175,55,0.4); transform: scale(1.02); } }
                    .gold-glow { animation: gold-pulse 4s ease-in-out infinite; }
                    .quote-fade { transition: opacity 1s ease-in-out; opacity: ${fade ? 1 : 0}; }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a3712; border-radius: 10px; }
                `}
            </style>

            <header className="z-50 p-6 flex justify-between items-center bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button onClick={() => setShowLangGrid(!showLangGrid)} className="text-yellow-600 hover:text-yellow-400 transition-all"><Globe size={24} /></button>
                        {showLangGrid && (
                            <div className="absolute top-10 left-0 bg-[#0a0a0a] border border-yellow-900/40 rounded-xl p-2 grid grid-cols-1 w-32 z-[60] shadow-2xl">
                                {Object.entries(LANGUAGES).map(([key, value]) => (
                                    <button key={key} onClick={() => {setLang(key); setShowLangGrid(false);}} className="p-3 text-xs hover:bg-yellow-900/20 text-left rounded"> {value.name} </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600 hover:text-yellow-400">
                        {music ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>
                {view !== 'landing' && <button onClick={() => setView('landing')} className="text-red-900/40 hover:text-red-500"><LogOut size={24} /></button>}
            </header>

            <main className="flex-1 flex flex-col relative z-20">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-start pt-12 space-y-14">
                        <div className="text-center space-y-2 gold-glow">
                            <h1 className="text-[11rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none">2in</h1>
                            <p className="text-[14px] tracking-[1.4em] text-yellow-700 uppercase font-sans font-bold ml-[1.4em]">twin</p>
                        </div>

                        <div className="max-w-3xl text-center px-10 h-24 flex items-center justify-center">
                            <p className="text-xl text-yellow-500/60 italic leading-relaxed quote-fade">{QUOTES[quoteIdx]}</p>
                        </div>

                        <button onClick={() => setView('onboarding')} className="mt-8 px-14 py-5 border border-yellow-600/30 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-[0.2em] uppercase text-md font-bold shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                            {LANGUAGES[lang].start}
                        </button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="max-w-xl w-full bg-black/60 border border-yellow-900/20 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
                            <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-3"><ShieldCheck className="text-yellow-600"/> {LANGUAGES[lang].promptTitle}</h3>
                            <div className="bg-yellow-900/10 p-5 rounded-xl border border-yellow-600/20 mb-6 group relative overflow-hidden">
                                <pre className="text-[10px] text-yellow-700 whitespace-pre-wrap font-sans leading-tight h-36 overflow-y-auto custom-scrollbar">
                                    {PROMPT_TEXT}
                                </pre>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="absolute top-3 right-3 p-2 bg-yellow-600/20 rounded-lg text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={LANGUAGES[lang].paste} className="w-full h-44 bg-black/40 border border-yellow-900/30 rounded-2xl p-6 text-yellow-100 font-mono text-sm focus:ring-1 focus:ring-yellow-500 outline-none" />
                            <button onClick={handleMatch} className="w-full mt-6 py-5 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-800 text-black font-black rounded-2xl tracking-widest uppercase text-lg">
                                {loading ? "..." : LANGUAGES[lang].find}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'matches' && (
                    <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                            {results.map(u => (
                                <div key={u.id} onClick={() => setActiveChat(u)} className={`p-7 rounded-3xl border transition-all cursor-pointer ${activeChat?.id === u.id ? 'bg-yellow-900/20 border-yellow-500 shadow-lg' : 'bg-white/5 border-white/5 hover:border-yellow-900/30'}`} >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-lg text-gray-300">{u.name}</span>
                                        <span className="text-xs bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full font-bold">{u.score}%</span>
                                    </div>
                                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-yellow-600 h-full transition-all duration-1000" style={{width: `${u.score}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="md:col-span-2 bg-black/40 border border-yellow-900/10 rounded-[3rem] flex flex-col relative shadow-inner">
                            {activeChat ? (
                                <div className="flex-1 flex flex-col h-full">
                                    <div className="p-7 border-b border-yellow-900/10 flex items-center gap-5 bg-yellow-900/5">
                                        <div className="w-12 h-12 rounded-full bg-yellow-700 flex items-center justify-center text-black font-bold text-xl">{activeChat.name[0]}</div>
                                        <div><p className="text-yellow-500 font-bold text-lg">{activeChat.name}</p><p className="text-xs text-green-700 animate-pulse uppercase tracking-tighter">Active Connection</p></div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-12 text-center text-gray-600 italic text-xl">"الصمت لغة الأرواح."</div>
                                    <div className="p-7 bg-black/60 flex gap-4">
                                        <input type="text" placeholder="اكتب رسالتك الوجودية..." className="flex-1 bg-white/5 border border-yellow-900/20 rounded-full px-7 py-4 text-md outline-none" />
                                        <button className="w-14 h-14 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-lg"><Send size={22} /></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-700 uppercase tracking-[0.3em] text-sm">اختر كياناً لتبدأ الحوار</div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
