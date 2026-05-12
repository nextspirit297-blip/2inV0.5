import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Volume2, VolumeX, Copy, Globe, Scan, LogIn, 
  UserPlus, Eye, EyeOff, LogOut, ArrowLeft, 
  Fingerprint, Activity, CheckCircle2, AlertCircle
} from 'lucide-react';

// إعداد Supabase - يدعم Vite و CRA
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PROMPT_TEXT = `ACT AS AN "ULTRA-HIGH RESOLUTION PSYCHOLOGICAL SPECTRAL ENGINE" (U-HRPSE).
OPERATIONAL LOGIC:
Each dimension: CORE (C) 0-15, SHADOW (S) 0-15, VELOCITY (V) -1 to +1.
FORMAT: Output a Base64 encoded JSON ARRAY of exactly 10 objects.
STRUCTURE: [{"C":x,"S":y,"V":z}, ...]
NO PROSE. ONLY BASE64.`;

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: ["1. انسخ البرومبت أدناه", "2. حاور الذكاء الاصطناعي بعمق", "3. انسخ كود Base64 الناتج", "4. الصقه في الحقل المخصص"],
        input: "أدخل بصمتك الوجودية (Base64) هنا...",
        match: "فك تشفير البصمة",
        resultsTitle: "الـصّـدَى الـوُجُـودِيّ",
        retry: "تحديث البصمة",
        login: "تسجيل الدخول",
        confirmLogin: "تأكيد الدخول",
        createAccount: "إنشاء حساب",
        guestLogin: "دخول كضيف",
        usernameLabel: "اسم المستخدم",
        passwordLabel: "كلمة المرور",
        back: "رجوع",
        loading: "جاري تحليل الأطياف...",
        copyDone: "تم النسخ!",
        quotes: [
            { text: "«الحقيقة لا توجد خارج المرء، بل هي كامنة في داخله.»", author: "كارل يونغ" },
            { text: "«من يمتلك سبباً يعيش من أجله، يمكنه تحمل أي شيء تقريباً.»", author: "فريدريك نيتشه" },
            { text: "«لا تصبح الرؤية واضحة إلا حين تنظر إلى قلبك.»", author: "كارل يونغ" },
            { text: "«من ينظر للخارج يحلم، ومن ينظر للداخل يستيقظ.»", author: "كارل يونغ" },
            { text: "«الجحيم هو الآخرون، حين نفشل في فهم ذواتنا.»", author: "جان بول سارتر" },
            { text: "«أصعب شيء هو أن تعرف نفسك.»", author: "سورين كيركغارد" },
            { text: "«الوعي هو المعاناة الكبرى، لكنه طريق الحرية.»", author: "فيودور دوستويفسكي" },
            { text: "«تكمن السعادة في معرفة الذات دون خوف.»", author: "أفلاطون" }
        ]
    },
    EN: {
        start: "START EXISTENTIAL JOURNEY",
        promptTitle: "Psychological Vector Prompt",
        guide: ["1. Copy the prompt below", "2. Deeply chat with your AI", "3. Copy the Base64 result", "4. Paste it here"],
        input: "Paste your existential code here...",
        match: "DECODE FINGERPRINT",
        resultsTitle: "Existential Echo",
        retry: "Update Fingerprint",
        login: "Sign In",
        confirmLogin: "Confirm",
        createAccount: "Create Account",
        guestLogin: "Guest Mode",
        usernameLabel: "Username",
        passwordLabel: "Password",
        back: "Back",
        loading: "Analyzing Spectra...",
        copyDone: "Copied!",
        quotes: [
            { text: "«Truth does not exist outside, but within.»", author: "Carl Jung" },
            { text: "«He who has a why to live can bear almost any how.»", author: "Friedrich Nietzsche" },
            { text: "«Who looks inside awakens.»", author: "Carl Jung" },
            { text: "«Man is the being who decides what he is.»", author: "Jean-Paul Sartre" }
        ]
    }
};

const Engine = {
    normalize: (val) => (val - 7.5) / 7.5,
    decode: (input) => {
        try {
            let clean = input.trim().replace(/```/g, '').replace(/\s/g, '');
            let decoded;
            try { decoded = atob(clean); } catch { decoded = clean; }
            let parsed = JSON.parse(decoded);
            let dims = Array.isArray(parsed) ? parsed : (parsed.dims || Object.values(parsed));
            
            const result = dims.slice(0, 10).map(d => {
                const C = Number(d.C ?? d.core ?? 7.5);
                const S = Number(d.S ?? d.shadow ?? 7.5);
                let V = Number(d.V ?? d.velocity ?? 0);
                if (V > 1 || V < -1) V = (V - 7.5) / 7.5;
                const comp = (C * 0.6) + (S * 0.3) + ((V * 7.5 + 7.5) * 0.1);
                return Engine.normalize(comp);
            });
            return result.length >= 10 ? result : null;
        } catch { return null; }
    },
    calculateSimilarity: (v1, v2) => {
        let dot = 0, m1 = 0, m2 = 0;
        for (let i = 0; i < 10; i++) {
            dot += v1[i] * v2[i];
            m1 += v1[i] * v1[i];
            m2 += v2[i] * v2[i];
        }
        const mag = Math.sqrt(m1) * Math.sqrt(m2);
        return mag === 0 ? 0 : (dot / mag + 1) / 2;
    }
};

export default function App() {
    const [view, setView] = useState('landing');
    const [lang, setLang] = useState('AR');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState([]);
    const [authForm, setAuthForm] = useState({ user: '', pass: '', mode: 'login' });
    const [showPass, setShowPass] = useState(false);
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const [copied, setCopied] = useState(false);

    const t = TRANSLATIONS[lang];

    // تدوير الحكم تلقائياً
    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setQuoteIdx(prev => (prev + 1) % t.quotes.length);
                setFade(true);
            }, 800);
        }, 8000);
        return () => clearInterval(timer);
    }, [t.quotes.length]);

    const handleAuth = async () => {
        if (!authForm.user || !authForm.pass) return;
        setLoading(true);
        const email = `${authForm.user.trim().toLowerCase()}@2in.internal`;
        try {
            let res;
            if (authForm.mode === 'signup') {
                res = await supabase.auth.signUp({ email, password: authForm.pass });
                if (res.data.user) await supabase.from('profiles').upsert({ id: res.data.user.id, username: authForm.user });
            } else {
                res = await supabase.auth.signInWithPassword({ email, password: authForm.pass });
            }
            if (res.error) throw res.error;
            setUser(res.data.user);
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', res.data.user.id).single();
            if (profile?.vector_data) fetchMatches(profile.vector_data, profile.username);
            else setView('onboarding');
        } catch (e) { alert(e.message); }
        setLoading(false);
    };

    const fetchMatches = async (vec, name) => {
        setLoading(true);
        const { data } = await supabase.from('profiles').select('username, vector_data').not('vector_data', 'is', null);
        const scored = data
            .filter(u => u.username !== name)
            .map(u => ({
                name: u.username,
                score: (Engine.calculateSimilarity(vec, u.vector_data) * 100).toFixed(1)
            }))
            .sort((a, b) => b.score - a.score);
        setResults(scored);
        setView('results');
        setLoading(false);
    };

    const handleMatch = async () => {
        const vec = Engine.decode(userInput);
        if (!vec) return alert("Invalid Vector Format");
        setLoading(true);
        try {
            const username = user ? (await supabase.from('profiles').select('username').eq('id', user.id).single()).data.username : "Guest";
            if (user) await supabase.from('profiles').upsert({ id: user.id, vector_data: vec, username });
            fetchMatches(vec, username);
        } catch (e) { alert("Database Error"); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-[#09090b] text-zinc-300 font-sans flex flex-col overflow-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
                .gold-gradient { background: linear-gradient(180deg, #fff 0%, #f59e0b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05); }
                .animate-glow { animation: glow 4s infinite alternate; }
                @keyframes glow { from { opacity: 0.3; } to { opacity: 0.6; } }
            `}</style>

            {/* الإضاءة الخلفية */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full animate-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-glow" />
            </div>

            {/* Header */}
            <header className="relative z-[100] p-6 flex justify-between items-center glass">
                <button onClick={() => setLang(l => l === 'AR' ? 'EN' : 'AR')} className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 active:scale-95">
                    <Globe size={18} className="text-amber-500" />
                    <span className="font-bold text-sm">{lang}</span>
                </button>
                {user && (
                    <button onClick={() => { supabase.auth.signOut(); setView('landing'); setUser(null); }} className="p-2 text-zinc-500 hover:text-red-400">
                        <LogOut size={20} />
                    </button>
                )}
            </header>

            <main className="flex-1 relative flex flex-col items-center px-6 overflow-y-auto pb-40">
                {view === 'landing' && (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="relative mb-12">
                            <h1 className="text-[10rem] font-black leading-none gold-gradient tracking-tighter">2in</h1>
                            <p className="tracking-[0.8em] text-amber-500 text-xs font-mono absolute bottom-4 left-1/2 -translate-x-1/2">TWIN ENGINE</p>
                        </div>
                        <button onClick={() => setView('auth')} className="w-64 py-5 bg-white text-black font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 uppercase tracking-widest">
                            {t.start}
                        </button>
                    </div>
                )}

                {view === 'auth' && (
                    <div className="w-full max-w-sm mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-4xl font-black text-center mb-10">{authForm.mode === 'login' ? t.login : t.createAccount}</h2>
                        <input placeholder={t.usernameLabel} className="w-full glass p-5 rounded-2xl outline-none focus:border-amber-500/50 text-lg" onChange={e => setAuthForm({...authForm, user: e.target.value})} />
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} placeholder={t.passwordLabel} className="w-full glass p-5 rounded-2xl outline-none focus:border-amber-500/50 text-lg" onChange={e => setAuthForm({...authForm, pass: e.target.value})} />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500">
                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button onClick={handleAuth} className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl text-xl hover:bg-amber-400">
                            {loading ? <Activity className="animate-spin mx-auto" /> : t.confirmLogin}
                        </button>
                        <div className="flex flex-col gap-3 pt-4">
                            <button onClick={() => setAuthForm({...authForm, mode: authForm.mode === 'login' ? 'signup' : 'login'})} className="text-zinc-500 text-sm hover:text-zinc-300">
                                {authForm.mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </button>
                            <button onClick={() => setView('onboarding')} className="text-amber-500/50 text-sm hover:text-amber-500">
                                {t.guestLogin}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="w-full max-w-xl mt-8 space-y-6">
                        <div className="p-8 rounded-[2.5rem] glass relative">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-amber-500">{t.promptTitle}</h3>
                                <button onClick={() => { navigator.clipboard.writeText(PROMPT_TEXT); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500/20">
                                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20}/>}
                                </button>
                            </div>
                            <div className="space-y-4 mb-8">
                                {t.guide.map((g, i) => (
                                    <div key={i} className="flex items-center gap-3 text-zinc-400 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" /> {g}
                                    </div>
                                ))}
                            </div>
                            <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder={t.input} className="w-full h-44 bg-black/40 border border-white/5 rounded-3xl p-5 font-mono text-amber-200 outline-none focus:border-amber-500/30 resize-none" />
                        </div>
                        <button onClick={handleMatch} disabled={loading || !userInput} className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-black rounded-3xl text-2xl shadow-2xl disabled:opacity-30">
                            {loading ? t.loading : t.match}
                        </button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="w-full max-w-md mt-10 space-y-4 animate-in slide-in-from-bottom-8">
                        <h2 className="text-4xl font-black text-center gold-gradient mb-8 tracking-wide">{t.resultsTitle}</h2>
                        <div className="space-y-3">
                            {results.length > 0 ? results.map((res, i) => (
                                <div key={i} className="flex justify-between items-center p-6 rounded-3xl glass group hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500">
                                            {res.name[0].toUpperCase()}
                                        </div>
                                        <span className="text-xl font-bold text-zinc-200">{res.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-amber-500">{res.score}%</span>
                                        <div className="w-20 h-1 bg-white/5 mt-1 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500" style={{ width: `${res.score}%` }} />
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 opacity-30 italic">No twins found yet...</div>
                            )}
                        </div>
                        <button onClick={() => setView('onboarding')} className="w-full py-5 text-zinc-500 flex items-center justify-center gap-2 mt-8 hover:text-white">
                            <Scan size={18} /> {t.retry}
                        </button>
                    </div>
                )}
            </main>

            {/* Footer Quotes */}
            <footer className="fixed bottom-0 left-0 right-0 p-10 text-center pointer-events-none bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent">
                <div className={`transition-all duration-1000 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-2xl text-amber-200/60 font-serif italic mb-2 px-4 leading-relaxed">
                        {t.quotes[quoteIdx].text}
                    </p>
                    <p className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase font-bold">
                        — {t.quotes[quoteIdx].author}
                    </p>
                </div>
            </footer>
        </div>
    );
}