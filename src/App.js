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
    ar: { name: "العربية", welcome: "مرحباً بك في الفضاء النفسي", start: "ابدأ الرحلة", guest: "دخول كضيف", promptTitle: "برومبت البصمة", copy: "نسخ البرومبت", paste: "أدخل بصمتك هنا", find: "توائمي", back: "عودة", settings: "إعدادات" },
    en: { name: "English", welcome: "Welcome to the Psychic Space", start: "Start Journey", guest: "Guest Login", promptTitle: "Fingerprint Prompt", copy: "Copy Prompt", paste: "Paste your fingerprint", find: "Find Twin", back: "Back", settings: "Settings" },
    fr: { name: "Français", welcome: "Bienvenue dans l'espace psychique", start: "Commencer", guest: "Invité", promptTitle: "Prompt d'empreinte", copy: "Copier", paste: "Collez votre empreinte", find: "Trouver mon jumeau", back: "Retour", settings: "Paramètres" },
    ru: { name: "Русский", welcome: "Добро пожаловать в психическое пространство", start: "Начать путь", guest: "Гость", promptTitle: "Промпт отпечатка", copy: "Копировать", paste: "Вставьте ваш код", find: "Найти близнеца", back: "Назад", settings: "Настройки" }
};

const Engine = {
    decode: (base64) => {
        try {
            const decoded = atob(base64);
            const array = JSON.parse(decoded);
            const vector = Array(30).fill(0.0);
            array.forEach((val, i) => { if(i < 30) vector[i] = val / 7.5; });
            return vector;
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
    const [myVector, setMyVector] = useState(null);
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
        if (music) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2;
    }, [music]);

    const handleMatch = async () => {
        const vec = Engine.decode(userInput);
        if (!vec) return alert("الكود غير صحيح، تأكد من نسخه كاملاً.");
        
        setMyVector(vec);
        setLoading(true);
        setView('matches');

        try {
            const { data: users, error } = await supabase
                .from('profiles')
                .select('id, username, vector_data');

            if (error) throw error;

            const scoredMatches = users
                .map(u => ({
                    id: u.id,
                    name: u.username,
                    score: (Engine.calculateSimilarity(vec, u.vector_data) * 100).toFixed(2)
                }))
                .filter(u => u.score > 0)
                .sort((a, b) => b.score - a.score);

            setResults(scoredMatches);
        } catch (err) {
            console.error("Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-serif overflow-hidden flex flex-col relative">
            {/* CSS Animations */}
            <style>
                {`
                    @keyframes fade { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }
                    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }
                    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
                    .animate-fade { animation: fade 10s infinite; }
                    .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a3712; border-radius: 10px; }
                `}
            </style>

            <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(50)].map((_, i) => (
                    <div key={i} className="absolute bg-white rounded-full" style={{ width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animation: `pulse ${Math.random() * 5 + 2}s infinite` }} />
                ))}
            </div>

            <header className="z-50 p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-yellow-900/20">
                <div className="flex flex-col group cursor-pointer">
                    <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-800 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all group-hover:scale-105">2in</h1>
                    <span className="text-[10px] text-yellow-700 tracking-[0.4em] uppercase -mt-1 font-sans">twin</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button onClick={() => setShowLangGrid(!showLangGrid)} className="text-yellow-600 hover:text-yellow-400 transition-all scale-110"><Globe size={22} /></button>
                        {showLangGrid && (
                            <div className="absolute top-10 right-0 bg-[#0a0a0a] border border-yellow-900/40 rounded-xl p-2 grid grid-cols-1 w-32 z-[60] shadow-2xl">
                                {Object.entries(LANGUAGES).map(([key, value]) => (
                                    <button key={key} onClick={() => {setLang(key); setShowLangGrid(false);}} className="p-2 text-[10px] hover:bg-yellow-900/20 text-left rounded"> {value.name} </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600 hover:text-yellow-400 transition-all">
                        {music ? <Volume2 size={22} /> : <VolumeX size={22} />}
                    </button>
                    {view !== 'landing' && <button onClick={() => setView('landing')} className="text-red-900/60 hover:text-red-500 transition-all"><LogOut size={22} /></button>}
                </div>
            </header>

            <div className="h-20 bg-gradient-to-r from-transparent via-yellow-900/5 to-transparent flex items-center justify-center px-10 border-y border-yellow-900/10 z-10">
                <p className="text-yellow-500/70 italic text-center text-sm md:text-lg animate-fade transition-opacity duration-1000 tracking-wide drop-shadow-[0_0_5px_rgba(212,175,55,0.2)]">
                    {QUOTES[quoteIdx]}
                </p>
            </div>

            <main className="flex-1 relative flex flex-col items-center justify-center p-6 z-20">
                {view === 'landing' && (
                    <div className="max-w-md w-full text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-light text-white leading-tight">{LANGUAGES[lang].welcome}</h2>
                            <p className="text-gray-500 font-sans tracking-widest text-xs uppercase">Decentralized Soul Matching</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <button onClick={() => setView('onboarding')} className="group relative overflow-hidden py-5 bg-transparent border border-yellow-600/40 rounded-full transition-all hover:border-yellow-500">
                                <div className="absolute inset-0 bg-yellow-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative text-yellow-500 font-bold tracking-[0.2em]">{LANGUAGES[lang].guest}</span>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="max-w-2xl w-full bg-black/60 border border-yellow-900/20 p-8 rounded-[2rem] backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-3"><ShieldCheck className="text-yellow-600"/> {LANGUAGES[lang].promptTitle}</h3>
                        <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-600/20 mb-6 group relative">
                            <pre className="text-[10px] text-yellow-700 whitespace-pre-wrap font-sans leading-relaxed">
                                {`You are a "Psychological Vector Engine". 
                                Based on our conversation, generate a 30-dimensional personality vector.
                                Represent each dimension from 0.0 to 15.0. 
                                Output only the Base64 encoded JSON array.`}
                            </pre>
                            <button onClick={() => navigator.clipboard.writeText("Generate my 30D personality vector as a Base64 encoded JSON array.")} className="absolute top-4 right-4 p-2 bg-yellow-600/20 rounded-lg text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all">
                                <Copy size={14} />
                            </button>
                        </div>
                        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={LANGUAGES[lang].paste} className="w-full h-40 bg-black/40 border border-yellow-900/30 rounded-2xl p-5 text-yellow-100 font-mono text-xs focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-gray-800" />
                        <button onClick={handleMatch} className="w-full mt-6 py-5 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-800 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all transform active:scale-95 uppercase tracking-widest">
                            {loading ? "جاري البحث..." : LANGUAGES[lang].find}
                        </button>
                    </div>
                )}

                {view === 'matches' && (
                    <div className="w-full max-w-6xl h-[70vh] grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="p-4 flex justify-between items-center border-b border-yellow-900/20">
                                <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-widest">المتطابقون</h4>
                                <button onClick={handleMatch} className="text-gray-500 hover:text-yellow-500 transition-colors"><RefreshCw size={16} /></button>
                            </div>
                            {results.length > 0 ? results.map(u => (
                                <div key={u.id} onClick={() => setActiveChat(u)} className={`p-6 rounded-2xl border transition-all cursor-pointer group ${activeChat?.id === u.id ? 'bg-yellow-900/20 border-yellow-500 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/5 hover:border-yellow-900/40 hover:bg-white/10'}`} >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-bold ${activeChat?.id === u.id ? 'text-yellow-400' : 'text-gray-300'}`}>{u.name}</span>
                                        <span className="text-[10px] bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded-full">{u.score}% Match</span>
                                    </div>
                                    <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-yellow-900 to-yellow-500 h-full transition-all duration-1000" style={{width: `${u.score}%`}}></div>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-600 py-10">لا يوجد متطابقون حالياً</p>}
                        </div>

                        <div className="col-span-12 md:col-span-8 bg-black/40 border border-yellow-900/10 rounded-[2.5rem] flex flex-col relative overflow-hidden shadow-2xl">
                            {activeChat ? (
                                <>
                                    <div className="p-6 border-b border-yellow-900/10 flex items-center gap-4 bg-yellow-900/5">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-900 flex items-center justify-center text-black font-bold">
                                            {activeChat.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-yellow-500 font-bold">{activeChat.name}</p>
                                            <p className="text-[10px] text-green-700 animate-pulse uppercase tracking-tighter">اتصال مشفر نشط</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 flex flex-col justify-center items-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-yellow-900/10 rounded-full flex items-center justify-center text-yellow-600/30">
                                            <MessageSquare size={32} />
                                        </div>
                                        <p className="text-gray-600 italic text-sm">"الصمت هنا ليس فراغاً، بل هو لغة الأرواح التي لا تحتاج لتفسير."</p>
                                    </div>
                                    <div className="p-6 bg-black/60 flex gap-4 items-center">
                                        <input type="text" placeholder="اكتب رسالتك الوجودية..." className="flex-1 bg-white/5 border border-yellow-900/20 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600 transition-all" />
                                        <button className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-700 space-y-4">
                                    <div className="w-24 h-24 border border-gray-900 rounded-full flex items-center justify-center animate-spin-slow">
                                        <div className="w-20 h-20 border border-yellow-900/20 rounded-full"></div>
                                    </div>
                                    <p className="text-xs uppercase tracking-[0.4em]">اختر كياناً لتبدأ الحوار</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {view === 'matches' && (
                <footer className="h-16 border-t border-yellow-900/20 bg-black/60 backdrop-blur-md flex justify-around items-center z-50">
                    <button onClick={() => setView('onboarding')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-yellow-500 transition-all">
                        <RefreshCw size={18} />
                        <span className="text-[8px] uppercase tracking-widest">تجديد البصمة</span>
                    </button>
                    <div className="h-8 w-px bg-yellow-900/20"></div>
                    <button className="flex flex-col items-center gap-1 text-yellow-500">
                        <MessageSquare size={18} />
                        <span className="text-[8px] uppercase tracking-widest">الرسائل</span>
                    </button>
                </footer>
            )}
        </div>
    );
}
