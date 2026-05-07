import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, LogOut, Send, MessageSquare, Image as ImageIcon, Mic, ChevronLeft, Copy, Globe } from 'lucide-react';

// --- القسم 1: الإعدادات والربط (ممنوع المساس) ---
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- القسم 2: مصفوفة الحكم (كاملة ومعدلة كما طلبت) ---
const QUOTES = [
    { 
        text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", 
        author: "هيرمان هسه" 
    },
    { 
        text: "«وتحسبُ أنك جرمٌ صغيرٌ.. وفيكَ انطوى العالمُ الأكبرُ.»", 
        author: "الإمام علي بن أبي طالب" 
    },
    { 
        text: "«من يعرف الآخرين فهو عالم، ومن يعرف نفسه فهو حكيم.»", 
        author: "لاوتسو" 
    },
    { 
        text: "«معرفة نفسك هي بداية كل حكمة.»", 
        author: "أرسطو" 
    },
    { 
        text: "«أنت لست قطرة في محيط، أنت المحيط بأكمله في قطرة.»", 
        author: "جلال الدين الرومي" 
    }
];

// --- القسم 3: الخوارزمية الرياضية (محرك 2in) ---
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
        return dot / (Math.sqrt(n1) * Math.sqrt(n2));
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

    // إدارة دورة الحكم
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

    // المنطق التشغيلي لسوبابايس (مطابقة التوائم)
    const handleMatch = async () => {
        const userVector = Engine.decode(userInput);
        if (!userVector) return alert("الشيفرة غير صالحة");
        
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
            console.error("Supabase Error:", e);
            // بيانات وهمية للاختبار فقط في حال فشل الاتصال
            setResults([...Array(10)].map((_, i) => ({ id: i, name: `كيان ${i+1}`, score: 99-i })));
            setView('main');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-[#020202] text-gray-300 font-serif flex flex-col relative overflow-hidden">
            
            <style>{`
                .gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote {
                    color: #ffd700;
                    text-shadow: 0 0 25px rgba(212, 175, 55, 0.5), 0 0 45px rgba(212, 175, 55, 0.3);
                    filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.6));
                }
                .quote-container { transition: all 1.5s ease-in-out; opacity: ${fade ? 1 : 0}; transform: translateY(${fade ? '0' : '15px'}); }
            `}</style>

            {/* سطر الحكم الذهبي المشع */}
            <div className="absolute top-[75%] left-0 w-full px-10 pointer-events-none z-10 text-center quote-container">
                <p className="text-2xl md:text-5xl spiritual-quote italic font-medium mb-4">
                    {QUOTES[quoteIdx].text}
                </p>
                <p className="text-xl text-yellow-600/60 font-light">— {QUOTES[quoteIdx].author}</p>
            </div>

            {/* Header مع زر اللغة */}
            <header className="h-20 flex justify-between items-center px-8 z-[100] relative">
                <div className="flex items-center gap-4">
                    <button onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')} className="text-yellow-600/60 border border-yellow-600/20 px-4 py-2 rounded-full text-xs flex items-center gap-2 bg-black/40">
                        <Globe size={14} /> {lang}
                    </button>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/40">
                        {music ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>
            </header>

            <main className="flex-1 relative z-50 flex flex-col overflow-hidden">
                
                {/* Landing View: الهندسة البصرية المثالية */}
                {view === 'landing' && (
                    <div className="flex-1 flex flex-col items-center relative h-full">
                        <div className="absolute top-[22%] flex flex-col items-center w-full">
                            <div className="flex items-baseline gap-6 mb-4">
                                <span className="text-[14rem] font-black gold-text leading-none">2</span>
                                <span className="text-[10rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-5xl tracking-[1.6em] text-yellow-500 uppercase font-black opacity-80 mr-[-1.6em]">
                                twin
                            </p>
                        </div>

                        <div className="absolute top-[52%] w-full flex justify-center">
                            <button 
                                onClick={() => setView('onboarding')}
                                className="w-[88%] py-12 border-2 border-yellow-600/40 rounded-full bg-yellow-900/5 shadow-[0_0_100px_rgba(212,175,55,0.1)] active:scale-95 transition-all"
                            >
                                <span className="text-5xl font-black text-yellow-500 uppercase tracking-widest">
                                    ابدأ الرحلة
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Onboarding View */}
                {view === 'onboarding' && (
                    <div className="flex-1 flex flex-col px-8 py-4 space-y-8 overflow-y-auto pb-44">
                        <div className="bg-white/5 border border-yellow-900/10 rounded-[3.5rem] p-10">
                            <span className="text-2xl font-bold text-yellow-500 block mb-6">برومبت البصمة</span>
                            <div className="text-sm text-yellow-800/40 leading-relaxed font-sans border-t border-yellow-900/10 pt-6">
                                {PROMPT_TEXT}
                            </div>
                        </div>
                        <textarea 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="أدخل بصمتك الوجودية هنا..."
                            className="w-full flex-1 min-h-[300px] bg-black/60 border border-yellow-900/20 rounded-[4rem] p-12 text-yellow-100 text-3xl outline-none focus:border-yellow-600 italic"
                        />
                        <button 
                            onClick={handleMatch}
                            className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-4xl uppercase tracking-widest shadow-2xl"
                        >
                            {loading ? "جاري المطابقة..." : "توائمي"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
