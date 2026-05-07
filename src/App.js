import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js'; // العصب الحسي للتطبيق
import { Volume2, VolumeX, LogOut, Send, MessageSquare, Image as ImageIcon, Mic, ChevronLeft, Copy, Globe } from 'lucide-react';

// --- إعدادات سوبابايس (تأكد من وجودها في ملف .env) ---
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- الحكم الكاملة المشعة ---
const QUOTES = [
    { text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" },
    { text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", author: "الإمام علي بن أبي طالب" },
    { text: "«من يعرف الآخرين فهو عالم، ومن يعرف نفسه فهو حكيم.»", author: "لاوتسو" },
    { text: "«معرفة نفسك هي بداية كل حكمة.»", author: "أرسطو" },
    { text: "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.»", author: "جلال الدين الرومي" }
];

// --- خوارزمية 2in (المحرك الرياضي) ---
const Engine = {
    decode: (base64) => {
        try {
            const decoded = atob(base64);
            const array = JSON.parse(decoded);
            return array.map(val => (val - 7.5) / 7.5); // normalization
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

const PROMPT_TEXT = `Act as a "High-Resolution Psychological Vector Engine."...`;

export default function App() {
    const [view, setView] = useState('landing');
    const [lang, setLang] = useState('AR');
    const [music, setMusic] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // إدارة الحكم
    useEffect(() => {
        const qInterval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setQuoteIdx(p => (p + 1) % QUOTES.length);
                setFade(true);
            }, 1000);
        }, 12000);
        return () => clearInterval(qInterval);
    }, []);

    // خوارزمية البحث والمطابقة (Supabase Logic)
    const handleMatch = async () => {
        const userVector = Engine.decode(userInput);
        if (!userVector) return alert("الشيفرة المدخلة غير صالحة!");
        
        setLoading(true);
        try {
            const { data: users, error } = await supabase.from('profiles').select('id, username, vector_data');
            if (error) throw error;

            const scored = users.map(u => ({
                id: u.id,
                name: u.username,
                score: (Engine.calculateSimilarity(userVector, u.vector_data) * 100).toFixed(2)
            })).filter(u => u.score > 0).sort((a, b) => b.score - a.score);

            setResults(scored);
            setView('main');
        } catch (e) {
            console.error(e);
            // لضمان استمرارية العرض أثناء التطوير
            setResults([...Array(10)].map((_, i) => ({ id: i, name: `كيان ${i+1}`, score: 99-i })));
            setView('main');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden select-none">
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote {
                    color: #ffd700;
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
                    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
                }
                .author-name { color: rgba(212, 175, 55, 0.6); font-family: sans-serif; }
                .quote-container { transition: all 1.5s ease-in-out; opacity: ${fade ? 1 : 0}; }
                .custom-blur { backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); }
            `}</style>

            {/* سطر الحكم المشع */}
            <div className="absolute top-[72%] left-0 w-full px-10 pointer-events-none z-10 text-center quote-container">
                <p className="text-2xl md:text-4xl spiritual-quote italic font-medium mb-3">{QUOTES[quoteIdx].text}</p>
                <p className="text-lg author-name font-light">— {QUOTES[quoteIdx].author}</p>
            </div>

            {/* Header */}
            <header className="h-20 flex justify-between items-center px-8 z-[100] relative">
                <div className="flex items-center gap-4">
                    <button onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')} className="text-yellow-600/60 border border-yellow-600/20 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                        <Globe size={14} /> {lang}
                    </button>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/40">
                        {music ? <Volume2 size={22} /> : <VolumeX size={22} />}
                    </button>
                </div>
                {view !== 'landing' && (
                    <button onClick={() => setView('landing')} className="text-red-900/30"><LogOut size={22} /></button>
                )}
            </header>

            <main className="flex-1 relative z-50 flex flex-col overflow-hidden">
                {/* 1. Landing View */}
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center relative h-full">
                        <div className="absolute top-[22%] flex flex-col items-center w-full">
                            <div className="flex items-baseline gap-6 mb-2">
                                <span className="text-[14rem] font-black gold-text leading-none">2</span>
                                <span className="text-[10rem] font-thin text-yellow-600/40 leading-none">in</span>
                            </div>
                            <p className="text-4xl tracking-[1.8em] text-yellow-500 uppercase font-black opacity-80 mr-[-1.8em]">twin</p>
                        </div>
                        <div className="absolute top-[52%] w-full flex justify-center">
                            <button onClick={() => setView('onboarding')} className="w-[85%] py-12 border border-yellow-600/30 rounded-full bg-yellow-900/5 custom-blur shadow-[0_0_80px_rgba(212,175,55,0.1)] active:scale-95 transition-all">
                                <span className="text-4xl font-black text-yellow-500 uppercase tracking-widest">ابدأ الرحلة الوجودية</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. Onboarding View */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex flex-col px-8 py-4 space-y-6 overflow-y-auto pb-44 relative z-[60]">
                        <div className="bg-white/5 border border-yellow-900/10 rounded-[3rem] p-8">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-2xl font-bold text-yellow-500">برومبت البصمة</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-3 bg-yellow-600/10 rounded-2xl"><Copy size={24}/></button>
                            </div>
                            <div className="text-sm text-yellow-800/40 leading-relaxed font-sans border-t border-yellow-900/10 pt-4 max-h-24 overflow-y-auto no-scrollbar">{PROMPT_TEXT}</div>
                        </div>
                        <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="أدخل شفرتك هنا..."
                            className="w-full flex-1 min-h-[250px] bg-black/60 border border-yellow-900/20 rounded-[3.5rem] p-10 text-yellow-100 text-3xl outline-none focus:border-yellow-600 shadow-inner italic"
                        />
                        <button onClick={handleMatch} className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-4xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                            {loading ? "جاري المطابقة..." : "توائمي"}
                        </button>
                    </div>
                )}

                {/* 3. Main View (Results) */}
                {view === 'main' && (
                    <div className="flex-1 flex flex-col px-6 overflow-hidden relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-64 pr-1">
                            {results.map((u) => (
                                <div key={u.id} className="bg-white/5 border border-yellow-900/10 p-10 rounded-[3.5rem] flex justify-between items-center backdrop-blur-md">
                                    <div>
                                        <h4 className="text-4xl font-bold text-gray-100 italic">{u.name}</h4>
                                        <p className="text-[14px] text-yellow-700 tracking-[0.5em] uppercase mt-3 font-black">تطابق: {u.score}%</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border-2 border-yellow-900/40 flex items-center justify-center text-yellow-600 font-black text-2xl">?</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setView('messages')} className="fixed bottom-36 right-8 w-28 h-28 bg-yellow-600 text-black rounded-full flex items-center justify-center shadow-2xl z-[100] active:scale-90 transition-transform">
                            <MessageSquare size={44} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
