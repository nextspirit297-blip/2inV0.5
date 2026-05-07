import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Music, Volume2, VolumeX, LogOut, ShieldCheck, Copy, Send } from 'lucide-react';

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
    ru: { name: "Русский", welcome: "Добро пожаловать في العالم النفسي", start: "Начать путь", guest: "Гость", promptTitle: "Промпт отпечатка", copy: "Коبيровать", paste: "Вставьте ваш код", find: "Найти близнеца", back: "Назад", settings: "Настройки" }
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
                    @keyframes gold-pulse { 0%, 100% { text-shadow: 0 0 30px rgba(212,175,55,0.5), 0 0 60px rgba(212,175,55,0.2); transform: scale(1); } 50% { text-shadow: 0 0 50px rgba(212,175,55,0.8), 0 0 90px rgba(212,175,55,0.4); transform: scale(1.02); } }
                    .gold-glow { animation: gold-pulse 4s ease-in-out infinite; }
                    .quote-fade { transition: opacity 1.2s ease-in-out, transform 1.2s ease-in-out; opacity: ${fade ? 1 : 0}; transform: translateY(${fade ? '0' : '10px'}); }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a3712; border-radius: 10px; }
                `}
            </style>

            <header className="z-50 p-8 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <button onClick={() => setShowLangGrid(!showLangGrid)} className="text-yellow-600 hover:text-yellow-400 transition-all"><Globe size={28} /></button>
                        {showLangGrid && (
                            <div className="absolute top-12 left-0 bg-[#0a0a0a] border border-yellow-900/40 rounded-xl p-3 grid grid-cols-1 w-40 z-[60] shadow-2xl">
                                {Object.entries(LANGUAGES).map(([key, value]) => (
                                    <button key={key} onClick={() => {setLang(key); setShowLangGrid(false);}} className="p-3 text-sm hover:bg-yellow-900/20 text-left rounded"> {value.name} </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600 hover:text-yellow-400">
                        {music ? <Volume2 size={28} /> : <VolumeX size={28} />}
                    </button>
                </div>
                {view !== 'landing' && <button onClick={() => setView('landing')} className="text-red-900/40 hover:text-red-500"><LogOut size={28} /></button>}
            </header>

            <main className="flex-1 flex flex-col relative z-20">
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-start pt-16 space-y-16">
                        <div className="text-center space-y-4 gold-glow">
                            {/* زيادة حجم العنوان بنسبة 25% من 12rem إلى 15rem */}
                            <h1 className="text-[15rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none">2in</h1>
                            {/* زيادة حجم twin بنسبة 25% من 20px إلى 25px */}
                            <p className="text-[25px] tracking-[1.6em] text-yellow-700 uppercase font-sans font-bold ml-[1.6em]">twin</p>
                        </div>

                        <div className="max-w-5xl text-center px-12 h-32 flex items-center justify-center mt-10">
                            <p className="text-3xl md:text-4xl text-yellow-500/70 italic leading-snug quote-fade font-medium">
                                {QUOTES[quoteIdx]}
                            </p>
                        </div>

                        {/* زيادة حجم زر الدخول بنسبة 25% (زيادة الـ padding والخط) */}
                        <button onClick={() => setView('onboarding')} className="mt-12 px-24 py-8 border-2 border-yellow-600/30 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-[0.3em] uppercase text-2xl font-black shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                            {LANGUAGES[lang].start}
                        </button>
                    </div>
                )}

                {/* باقي الكود كما هو للحفاظ على حجم الحكم وبقية العناصر */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="max-w-2xl w-full bg-black/70 border border-yellow-900/20 p-12 rounded-[4rem] backdrop-blur-2xl shadow-2xl">
                            <h3 className="text-3xl text-yellow-500 mb-8 flex items-center gap-4 font-bold"><ShieldCheck size={32} className="text-yellow-600"/> {LANGUAGES[lang].promptTitle}</h3>
                            <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-600/20 mb-8 group relative overflow-hidden">
                                <pre className="text-xs text-yellow-700 whitespace-pre-wrap font-sans leading-relaxed h-40 overflow-y-auto custom-scrollbar">
                                    {PROMPT_TEXT}
                                </pre>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="absolute top-4 right-4 p-3 bg-yellow-600/20 rounded-xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all">
                                    <Copy size={20} />
                                </button>
                            </div>
                            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={LANGUAGES[lang].paste} className="w-full h-52 bg-black/40 border border-yellow-900/30 rounded-3xl p-8 text-yellow-100 font-mono text-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
                            <button onClick={handleMatch} className="w-full mt-8 py-6 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-800 text-black font-black rounded-3xl tracking-[0.2em] uppercase text-2xl shadow-xl">
                                {loading ? "..." : LANGUAGES[lang].find}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'matches' && (
                    <div className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="md:col-span-1 space-y-6 overflow-y-auto max-h-[75vh] pr-4 custom-scrollbar">
                            {results.map(u => (
                                <div key={u.id} onClick={() => setActiveChat(u)} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer ${activeChat?.id === u.id ? 'bg-yellow-900/20 border-yellow-500 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-yellow-900/30'}`} >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-2xl text-gray-300">{u.name}</span>
                                        <span className="text-sm bg-yellow-600/20 text-yellow-500 px-4 py-1.5 rounded-full font-black">{u.score}%</span>
                                    </div>
                                    <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-yellow-600 h-full transition-all duration-1000" style={{width: `${u.score}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="md:col-span-2 bg-black/40 border border-yellow-900/10 rounded-[4rem] flex flex-col relative shadow-2xl">
                            {activeChat ? (
                                <div className="flex-1 flex flex-col h-full">
                                    <div className="p-8 border-b border-yellow-900/10 flex items-center gap-6 bg-yellow-900/5">
                                        <div className="w-16 h-16 rounded-full bg-yellow-700 flex items-center justify-center text-black font-black text-2xl">{activeChat.name[0]}</div>
                                        <div><p className="text-yellow-500 font-black text-2xl">{activeChat.name}</p><p className="text-sm text-green-700 animate-pulse uppercase tracking-widest font-bold">Connection Established</p></div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-16 text-center text-gray-500 italic text-3xl font-light">"الصمت لغة الأرواح."</div>
                                    <div className="p-8 bg-black/60 flex gap-6">
                                        <input type="text" placeholder="اكتب رسالتك الوجودية..." className="flex-1 bg-white/5 border border-yellow-900/20 rounded-full px-8 py-5 text-lg outline-none focus:border-yellow-500 transition-all" />
                                        <button className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-2xl"><Send size={28} /></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-700 uppercase tracking-[0.4em] text-lg font-bold">اختر كياناً لتبدأ الحوار</div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
