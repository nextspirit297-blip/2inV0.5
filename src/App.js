import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Volume2, VolumeX, LogOut, ShieldCheck, Copy, Send } from 'lucide-react';

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
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [showLangGrid, setShowLangGrid] = useState(false);
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
                    @keyframes gold-pulse { 0%, 100% { text-shadow: 0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(212,175,55,0.3); transform: scale(1); } 50% { text-shadow: 0 0 60px rgba(212,175,55,0.9), 0 0 110px rgba(212,175,55,0.5); transform: scale(1.02); } }
                    .gold-glow { animation: gold-pulse 4s ease-in-out infinite; }
                    .quote-fade { transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out; opacity: ${fade ? 0.7 : 0}; transform: translateY(${fade ? '0' : '20px'}); }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a3712; border-radius: 10px; }
                `}
            </style>

            <header className="z-50 p-8 flex justify-between items-center relative">
                <div className="flex items-center gap-10">
                    <div className="relative">
                        <button onClick={() => setShowLangGrid(!showLangGrid)} className="text-yellow-600 hover:text-yellow-400 transition-all"><Globe size={32} /></button>
                        {showLangGrid && (
                            <div className="absolute top-12 left-0 bg-[#0a0a0a] border border-yellow-900/40 rounded-xl p-4 grid grid-cols-1 w-48 z-[60] shadow-2xl">
                                {Object.entries(LANGUAGES).map(([key, value]) => (
                                    <button key={key} onClick={() => {setLang(key); setShowLangGrid(false);}} className="p-3 text-md hover:bg-yellow-900/20 text-left rounded"> {value.name} </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600 hover:text-yellow-400">
                        {music ? <Volume2 size={32} /> : <VolumeX size={32} />}
                    </button>
                </div>
                {view !== 'landing' && <button onClick={() => setView('landing')} className="text-red-900/40 hover:text-red-500"><LogOut size={32} /></button>}
            </header>

            <main className="flex-1 flex flex-col relative z-20">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-between py-20 px-6">
                        {/* العنوان: زيادة 40% (من 12rem إلى حوالي 17rem) */}
                        <div className="text-center space-y-6 gold-glow mt-10">
                            <h1 className="text-[17rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none select-none">2in</h1>
                            <p className="text-[32px] tracking-[2em] text-yellow-700 uppercase font-sans font-bold ml-[2em]">twin</p>
                        </div>

                        {/* زر الدخول: زيادة 50% في الحجم والبروز */}
                        <div className="w-full flex justify-center">
                            <button onClick={() => setView('onboarding')} className="px-32 py-12 border-2 border-yellow-600/40 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-[0.4em] uppercase text-4xl font-black shadow-[0_0_70px_rgba(212,175,55,0.2)] hover:scale-105 active:scale-95">
                                {LANGUAGES[lang].start}
                            </button>
                        </div>

                        {/* الحكم في الجزء السفلي مع Fade أبطأ وأعمق */}
                        <div className="max-w-6xl text-center px-10 h-32 flex items-center justify-center mb-10">
                            <p className="text-3xl md:text-5xl text-yellow-600/40 italic leading-snug quote-fade font-light">
                                {QUOTES[quoteIdx]}
                            </p>
                        </div>
                    </div>
                )}

                {/* بقية الواجهات تحافظ على نفس فلسفة الأحجام الجديدة */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="max-w-3xl w-full bg-black/80 border border-yellow-900/20 p-16 rounded-[5rem] backdrop-blur-3xl shadow-2xl">
                            <h3 className="text-4xl text-yellow-500 mb-10 flex items-center gap-6 font-bold"><ShieldCheck size={40} className="text-yellow-600"/> {LANGUAGES[lang].promptTitle}</h3>
                            <div className="bg-yellow-900/10 p-8 rounded-3xl border border-yellow-600/20 mb-10 group relative overflow-hidden">
                                <pre className="text-sm text-yellow-700 whitespace-pre-wrap font-sans leading-relaxed h-48 overflow-y-auto custom-scrollbar">
                                    {PROMPT_TEXT}
                                </pre>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="absolute top-6 right-6 p-4 bg-yellow-600/20 rounded-2xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all">
                                    <Copy size={24} />
                                </button>
                            </div>
                            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={LANGUAGES[lang].paste} className="w-full h-64 bg-black/40 border border-yellow-900/30 rounded-[3rem] p-10 text-yellow-100 font-mono text-xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-inner" />
                            <button onClick={handleMatch} className="w-full mt-10 py-8 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-800 text-black font-black rounded-[2.5rem] tracking-[0.3em] uppercase text-3xl shadow-2xl">
                                {loading ? "..." : LANGUAGES[lang].find}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'matches' && (
                    <div className="flex-1 max-w-[90rem] w-full mx-auto p-12 grid grid-cols-1 md:grid-cols-3 gap-14">
                        <div className="md:col-span-1 space-y-8 overflow-y-auto max-h-[75vh] pr-6 custom-scrollbar">
                            {results.map(u => (
                                <div key={u.id} onClick={() => setActiveChat(u)} className={`p-10 rounded-[3rem] border transition-all cursor-pointer ${activeChat?.id === u.id ? 'bg-yellow-900/30 border-yellow-500 shadow-2xl scale-105' : 'bg-white/5 border-white/5 hover:border-yellow-900/40'}`} >
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-bold text-3xl text-gray-200">{u.name}</span>
                                        <span className="text-lg bg-yellow-600/20 text-yellow-500 px-5 py-2 rounded-full font-black">{u.score}%</span>
                                    </div>
                                    <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden">
                                        <div className="bg-yellow-600 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{width: `${u.score}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="md:col-span-2 bg-black/50 border border-yellow-900/10 rounded-[5rem] flex flex-col relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                            {activeChat ? (
                                <div className="flex-1 flex flex-col h-full">
                                    <div className="p-10 border-b border-yellow-900/10 flex items-center gap-8 bg-yellow-900/5">
                                        <div className="w-20 h-20 rounded-full bg-yellow-700 flex items-center justify-center text-black font-black text-3xl shadow-lg">{activeChat.name[0]}</div>
                                        <div><p className="text-yellow-500 font-black text-4xl mb-1">{activeChat.name}</p><p className="text-md text-green-700 animate-pulse uppercase tracking-[0.3em] font-bold">Synchronizing Souls</p></div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-20 text-center text-gray-500 italic text-4xl font-extralight leading-relaxed tracking-wide">"الصمت لغة الأرواح."</div>
                                    <div className="p-10 bg-black/70 flex gap-8">
                                        <input type="text" placeholder="اكتب رسالتك الوجودية..." className="flex-1 bg-white/5 border border-yellow-900/20 rounded-full px-10 py-6 text-xl outline-none focus:border-yellow-500 transition-all shadow-inner" />
                                        <button className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-2xl active:scale-90"><Send size={36} /></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-800 uppercase tracking-[0.5em] text-2xl font-black opacity-40">اختر كياناً لتبدأ الحوار</div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
