import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Volume2, VolumeX, LogOut, Send, MessageSquare, Image as ImageIcon, Mic, ChevronLeft, Copy, ShieldCheck } from 'lucide-react';

// --- الإعدادات التقنية الكاملة ---
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
    ar: { start: "ابدأ الرحلة الوجودية", promptTitle: "برومبت البصمة", paste: "أدخل بصمتك هنا", find: "توائمي", chatTitle: "المحادثات الوجودية", back: "عودة" },
    en: { start: "Begin Journey", promptTitle: "Fingerprint Prompt", paste: "Paste your fingerprint", find: "Find Twin", chatTitle: "Existential Chats", back: "Back" }
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

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine." Strip away all flattery and social bias for clinical accuracy. Generate a 30-dimensional personality vector (0.0 to 15.0) based on these polarities: 1.Nihilism/Meaning, 2.Logic/Intuition, 3.Stoicism/Empathy, 4.Solitude/Belonging, 5.Material/Spiritual, 6.Chaos/Order, 7.Skeptic/Faith, 8.Rebel/Conformist, 9.Nostalgia/Future, 10.Ego/Altruism, 11.Aesthetic/Utility, 12.Moral/Ethics, 13.Fear/Acceptance, 14.Power/Peace, 15.Science/Mystic, 16.Risk/Security, 17.Vulnerability/Control, 18.Arrogance/Humility, 19.Attachment/Freedom, 20.Silence/Noise, 21.Complexity/Simplicity, 22.Ambition/Observation, 23.Cynic/Romantic, 24.Reality/Delusion, 25.Vitality/Decay, 26.Collective/Individual, 27.Curiosity/Saturation, 28.Forgive/Grudge, 29.Validation/Sovereignty, 30.Depth/Surface. Output ONLY the raw Base64 encoded JSON array.`;

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
        try {
            const { data: users } = await supabase.from('profiles').select('id, username, vector_data');
            const scored = (users || []).map(u => ({
                id: u.id,
                name: u.username,
                score: (Engine.calculateSimilarity(vec, u.vector_data) * 100).toFixed(2)
            })).filter(u => u.score > 0).sort((a, b) => b.score - a.score);
            setResults(scored.length > 0 ? scored : [...Array(10)].map((_, i) => ({ id: i, name: `كيان ${i+1}`, score: 99-i })));
            setView('main');
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden">
            <style>{`
                @keyframes gold-pulse { 0%, 100% { text-shadow: 0 0 40px rgba(212,175,55,0.6); } 50% { text-shadow: 0 0 60px rgba(212,175,55,0.9); } }
                .gold-glow { animation: gold-pulse 4s ease-in-out infinite; }
                .quote-fade { transition: all 1.5s ease-in-out; opacity: ${fade ? 0.3 : 0}; transform: translateY(${fade ? '0' : '15px'}); }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {/* Header: العنوان المصغر */}
            <header className="z-50 px-8 h-24 flex justify-between items-center relative">
                <div className="flex items-center gap-8">
                    {view !== 'landing' && (
                        <div className="flex flex-col leading-none select-none">
                            <span className="text-4xl font-black text-yellow-500 tracking-tighter">2in</span>
                            <span className="text-[8px] text-yellow-700 tracking-widest uppercase font-sans">twin</span>
                        </div>
                    )}
                    <button onClick={() => setMusic(!music)} className="text-yellow-600">
                        {music ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>
                {view !== 'landing' && (
                    <button onClick={() => setView('landing')} className="text-red-900/40 hover:text-red-500"><LogOut size={24} /></button>
                )}
            </header>

            <main className="flex-1 flex flex-col relative z-20 overflow-hidden">
                
                {/* 1. Landing View */}
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center justify-around py-12 px-6">
                        <div className="text-center space-y-4 gold-glow">
                            <h1 className="text-[12rem] md:text-[16rem] font-black tracking-tighter bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent leading-none">2in</h1>
                            <p className="text-2xl md:text-3xl tracking-[1.5em] text-yellow-700 uppercase font-sans font-bold ml-4">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="px-20 py-8 border-2 border-yellow-600/40 rounded-full text-yellow-500 hover:bg-yellow-600/10 transition-all tracking-[0.4em] uppercase text-3xl font-black shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                            {LANGUAGES[lang].start}
                        </button>
                    </div>
                )}

                {/* 2. Onboarding View */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex flex-col p-6 space-y-8 overflow-y-auto hide-scrollbar pb-32">
                        <div className="bg-white/5 border border-yellow-900/10 rounded-[3rem] p-8 shadow-2xl relative">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-3xl text-yellow-500 font-bold flex items-center gap-4"><ShieldCheck className="text-yellow-700" /> {LANGUAGES[lang].promptTitle}</h3>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-4 bg-yellow-600/10 rounded-2xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"><Copy size={20}/></button>
                            </div>
                            <div className="h-48 overflow-y-auto hide-scrollbar text-yellow-800 italic leading-relaxed font-sans text-lg border-t border-yellow-900/20 pt-6">
                                {PROMPT_TEXT}
                            </div>
                        </div>
                        
                        <textarea 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={LANGUAGES[lang].paste}
                            className="w-full h-64 bg-black/40 border border-yellow-900/20 rounded-[3rem] p-8 text-yellow-100 text-xl focus:ring-1 focus:ring-yellow-500 outline-none resize-none shadow-inner"
                        />
                        
                        <button onClick={handleMatch} className="w-full py-10 bg-yellow-600 text-black font-black rounded-full text-3xl uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">
                            {loading ? "..." : LANGUAGES[lang].find}
                        </button>
                    </div>
                )}

                {/* 3. Main View (الرادار) */}
                {view === 'main' && (
                    <div className="flex-1 flex flex-col px-6 relative">
                        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pb-48">
                            {results.map((u) => (
                                <div key={u.id} className="bg-white/5 border border-yellow-900/10 p-8 rounded-[3rem] flex justify-between items-center group active:bg-yellow-900/10 transition-all">
                                    <div>
                                        <h4 className="text-2xl font-bold text-gray-200">{u.name}</h4>
                                        <p className="text-sm text-yellow-800 mt-2">توافق وجودي بنسبة {u.score}%</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-full border border-yellow-900/20 flex items-center justify-center text-yellow-700 text-xl font-black shadow-lg">?</div>
                                </div>
                            ))}
                        </div>
                        
                        {/* زر الرسائل الجانبي */}
                        <button 
                            onClick={() => setView('messages')}
                            className="fixed bottom-40 right-8 w-20 h-20 bg-yellow-600 text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] z-[60] active:scale-90 transition-transform"
                        >
                            <MessageSquare size={32} />
                        </button>
                    </div>
                )}

                {/* 4. Messages View */}
                {view === 'messages' && (
                    <div className="flex-1 flex flex-col px-6 space-y-6 pb-40 overflow-hidden">
                        <div className="flex items-center gap-6 h-16">
                            <button onClick={() => setView('main')} className="text-yellow-600 hover:text-yellow-400"><ChevronLeft size={40}/></button>
                            <h2 className="text-3xl font-black text-yellow-500 uppercase tracking-widest">{LANGUAGES[lang].chatTitle}</h2>
                        </div>
                        
                        <div className="flex-1 bg-white/5 border border-yellow-900/10 rounded-[4rem] p-8 flex flex-col relative overflow-hidden">
                            <div className="flex-1 flex items-center justify-center text-gray-800 text-center text-2xl italic tracking-widest opacity-20">
                                اختر اتصالاً لكسر حاجز الصمت
                            </div>
                            
                            {/* صندوق الرسائل المتطور */}
                            <div className="mt-auto pt-6 flex items-center gap-4 bg-black border border-yellow-900/30 rounded-full p-3 pl-6 shadow-2xl">
                                <button className="text-yellow-700 hover:text-yellow-500 transition-colors"><ImageIcon size={28} /></button>
                                <input type="text" placeholder="تحدث..." className="flex-1 bg-transparent border-none outline-none text-xl text-yellow-100" />
                                <button className="text-yellow-700 hover:text-yellow-500 transition-colors"><Mic size={28} /></button>
                                <button className="w-16 h-16 bg-yellow-600 text-black rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"><Send size={24} /></button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer: الحكم في مكانها الثابت والمرفوع */}
            <footer className="fixed bottom-0 left-0 w-full h-32 flex items-center justify-center px-10 pointer-events-none z-10">
                <p className="text-center text-lg md:text-2xl text-yellow-600/30 italic leading-snug quote-fade font-light mb-8">
                    {QUOTES[quoteIdx]}
                </p>
            </footer>
        </div>
    );
}
