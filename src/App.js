import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, Scan, LogIn, UserPlus, Eye, EyeOff, LogOut, ArrowLeft } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const PROMPT_TEXT = `ACT AS AN "ULTRA-HIGH RESOLUTION PSYCHOLOGICAL SPECTRAL ENGINE" (U-HRPSE).

OPERATIONAL LOGIC:
Each dimension is analyzed through three distinct layers:
1. CORE (C): The baseline trait / Conscious identity (0.00 - 15.00).
2. SHADOW (S): The suppressed/latent counter-trait or volatility under stress (0.00 - 15.00).
3. VELOCITY (V): The rate of change or growth potential in this dimension (-1.00 to +1.00).

DIMENSIONS & ARCHETYPES:
1. Cognitive Architecture: [Linear/Mechanical ↔ Nonlinear/Quantum]
2. Existential Weight: [Materialist/Pragmatic ↔ Metaphysical/Transcendental]
3. Emotional Processing: [Clinical/Dissociated ↔ Hyper-Somatic/Resonant]
4. Volition/Agency: [Deterministic/Passive ↔ Radical Autonomy]
5. Pattern Intelligence: [Noise-Blind ↔ Archetypal Recognition]
6. Social Matrix: [Solitary/Sovereign ↔ Collective/Interdependent]
7. Temporal Anchor: [Past-Locked/Traumatic ↔ Future-Oriented/Prophetic]
8. Moral Flux: [Rigid/Absolute ↔ Situational/Fluid]
9. Resilience Topology: [Fragile/Static ↔ Anti-Fragile/Adaptive]
10. Creative Impulse: [Derivative/Refining ↔ Radical Synthesis/Chaos]

STRICT OUTPUT PROTOCOL:
- SILENT PROCESSING: No preamble, no justifications.
- FORMAT: Output a Base64 encoded JSON object containing the matrix [Dimension: {C, S, V}].
- NO PROSE: Only the raw Base64 string inside a markdown code block.

EXECUTE FULL SPECTRAL MAPPING NOW.`;

const TRANSLATIONS = {
    AR: {
        start: "ابدأ الرحلة الوجودية",
        promptTitle: "برومبت البصمة النفسية",
        guide: [
            "1. قم بنسخ البرومبت الكامل من الصندوق أدناه.",
            "2. توجه إلى أي ذكاء اصطناعي اعتاد الدردشة معك (مثل Gemini أو ChatGPT).",
            "3. امنحه البرومبت؛ وتذكر أنه كلما كان حوارك أعمق، كانت البصمة أدق في تمثيلك.",
            "4. انسخ كود (Base64) الناتج وألصقه في الحقل المخصص هنا."
        ],
        input: "أدخل بصمتك الوجودية هنا...",
        match: "فك تشفير البصمة",
        resultsTitle: "الـصّـدَى الـوُجُـودِيّ",
        retry: "تحديث البصمة",
        googleLogin: "الدخول عبر جوجل",
        createAccount: "إنشاء حساب",
        guestLogin: "الدخول كضيف",
        guestWarning: "ملاحظة: الدخول كضيف لا يسمح باسترجاع بياناتك أو رسائلك مستقبلاً بعد تسجيل الخروج.",
        usernameLabel: "اسم المستخدم",
        passwordLabel: "كلمة المرور",
        usernameTaken: "اسم المستخدم مستخدم من قبل",
        confirmSignup: "تأكيد إنشاء الحساب",
        confirmGuest: "تأكيد الدخول كضيف",
        back: "رجوع",
        googleNameQuestion: "هل تريد استخدام اسمك من جوجل أم اختيار اسم مخصص؟",
        useGoogleName: "استخدام اسم جوجل",
        chooseCustomName: "اختيار اسم مخصص",
        enterCustomName: "أدخل اسمك المخصص",
        confirmName: "تأكيد",
        signupSuccess: "تم إنشاء الحساب بنجاح",
        quotes: [
            { text: "«الحقيقة لا توجد خارج المرء، بل هي كامنة في داخله.»", author: "كارل يونغ" },
            { text: "«من يمتلك سبباً يعيش من أجله، يمكنه تحمل أي شيء تقريباً.»", author: "فريدريك نيتشه" },
            { text: "«لا تصبح الرؤية واضحة إلا حين تنظر إلى قلبك.»", author: "كارل يونغ" },
            { text: "«من ينظر للخارج يحلم، ومن ينظر للداخل يستيقظ.»", author: "كارل يونغ" },
            { text: "«الجحيم هو الآخرون، حين نفشل في فهم ذواتنا بعيداً عن أحكامهم.»", author: "جان بول سارتر" },
            { text: "«أصعب شيء في الحياة هو أن تعرف نفسك، وأسهل شيء هو أن تعطي نصيحة للآخرين.»", author: "سورين كيركغارد" },
            { text: "«الوعي هو المعاناة الكبرى، لكنه الطريق الوحيد للحرية.»", author: "فيودور دوستويفسكي" },
            { text: "«كل إنسان لديه ذكريات لا يشاركها إلا مع نفسه، وأخرى لا يجرؤ حتى على كشفها لنفسه.»", author: "فيودور دوستويفسكي" },
            { text: "«تكمن السعادة في قدرة المرء على استكشاف و معرفة ذاته دون خوف.»", author: "أفلاطون" },
            { text: "«لا يمكنك تغيير أي شيء ما لم تتقبله أولاً.»", author: "كارل يونغ" },
            { text: "«نحن لا نكبر عبر السنين، بل نتجدد كل يوم من خلال فهمنا لذواتنا.»", author: "هرمان هسه" },
            { text: "«الإنسان هو الكائن الذي يقرر دائماً ما هو عليه.»", author: "جان بول سارتر" },
            { text: "«الهروب من الذات هو أقصر طريق للضياع في الزحام.»", author: "سورين كيركغارد" },
            { text: "«ما لا نواجهه في ذواتنا، سنواجهه في العالم الخارجي كقدر.»", author: "كارل يونغ" },
            { text: "«المعرفة الحقيقية هي أن تدرك مدى جهلك بنفسك أولاً.»", author: "سقراط" },
            { text: "«الاستقامة مع الذات هي أصعب أنواع الأمانة وأندرها.»", author: "فريدريك نيتشه" }
        ]
    },
    EN: {
    start: "START EXISTENTIAL JOURNEY",
    promptTitle: "Psychological Vector Prompt",
    guide: [
        "1. Copy the full prompt from the box below.",
        "2. Provide it to your AI companion.",
        "3. Deep interaction results in a more accurate fingerprint.",
        "4. Paste the Base64 code here."
    ],
    input: "Paste your existential code here...",
    match: "DECODE FINGERPRINT",
    resultsTitle: "Existential Echo",
    retry: "Update Fingerprint",
    googleLogin: "Sign in with Google",
    createAccount: "Create Account",
    guestLogin: "Continue as Guest",
    guestWarning: "Note: Guest mode does not allow data recovery after logout.",
    usernameLabel: "Username",
    passwordLabel: "Password",
    usernameTaken: "Username already taken",
    confirmSignup: "Confirm Sign Up",
    confirmGuest: "Confirm Guest Entry",
    back: "Back",
    googleNameQuestion: "Use your Google name or choose a custom one?",
    useGoogleName: "Use Google Name",
    chooseCustomName: "Choose Custom Name",
    enterCustomName: "Enter your custom name",
    confirmName: "Confirm",
    signupSuccess: "Account created successfully",
    quotes: [
        { text: "«Truth does not exist outside the person, but lies dormant within.»", author: "Carl Jung" },
        { text: "«He who has a why to live can bear almost any how.»", author: "Friedrich Nietzsche" },
        { text: "«Vision becomes clear only when you look into your heart.»", author: "Carl Jung" },
        { text: "«Who looks outside dreams; who looks inside awakens.»", author: "Carl Jung" },
        { text: "«Hell is other people, when we fail to understand ourselves beyond their judgment.»", author: "Jean-Paul Sartre" },
        { text: "«The hardest thing in life is to know yourself; the easiest is to give advice to others.»", author: "Søren Kierkegaard" },
        { text: "«Consciousness is the greatest suffering, yet the only path to freedom.»", author: "Fyodor Dostoevsky" },
        { text: "«Every person has memories shared only with themselves, and others they dare not reveal even to themselves.»", author: "Fyodor Dostoevsky" },
        { text: "«Happiness lies in the ability to know oneself without fear.»", author: "Plato" },
        { text: "«You cannot change anything unless you first accept it.»", author: "Carl Jung" },
        { text: "«We do not grow older through years, but renew ourselves daily through understanding ourselves.»", author: "Hermann Hesse" },
        { text: "«Man is the being who always decides what he is.»", author: "Jean-Paul Sartre" },
        { text: "«Fleeing from oneself is the shortest path to losing oneself in the crowd.»", author: "Søren Kierkegaard" },
        { text: "«What we do not face within ourselves, we will meet in the outer world as fate.»", author: "Carl Jung" },
        { text: "«True knowledge is realizing how ignorant you are of yourself first.»", author: "Socrates" },
        { text: "«Integrity with oneself is the hardest and rarest form of honesty.»", author: "Friedrich Nietzsche" }
    ]
},   
RU: {
        start: "НАЧАТЬ ПУТЕШЕСТВИЕ",
        promptTitle: "Экзистенциальный запрос",
        guide: [
            "1. Скопируйте полный запрос из поля ниже.",
            "2. Передайте его любому ИИ (Gemini, ChatGPT и т. д.).",
            "3. Помните: чем глубже ваш диалог, тем точнее будет ваш отпечаток.",
            "4. Скопируйте полученный Base64-код и вставьте его здесь."
        ],
        input: "Вставьте ваш экзистенциальный код...",
        match: "РАСШИФРОВАТЬ ОТПЕЧАТОК",
        resultsTitle: "Экзистенциальное Эхо",
        retry: "Обновить отпечаток",
        googleLogin: "Войти через Google",
        createAccount: "Создать аккаунт",
        guestLogin: "Продолжить как гость",
        guestWarning: "Примечание: Гостевой режим не позволяет восстановить данные после выхода.",
        usernameLabel: "Имя пользователя",
        passwordLabel: "Пароль",
        usernameTaken: "Имя пользователя уже занято",
        confirmSignup: "Подтвердить регистрацию",
        confirmGuest: "Подтвердить вход как гость",
        back: "Назад",
        googleNameQuestion: "Использовать имя из Google или выбрать своё?",
        useGoogleName: "Использовать имя Google",
        chooseCustomName: "Выбрать своё имя",
        enterCustomName: "Введите своё имя",
        confirmName: "Подтвердить",
        signupSuccess: "Аккаунт успешно создан",
        quotes: [
            { text: '«Истина не существует вне человека, она дремлет внутри него.»', author: 'Карл Юнг' },
            { text: '«Тот, у кого есть "зачем" жить, может выдержать почти любое "как".»', author: 'Фридрих Ницше' },
            { text: '«Видение становится ясным только тогда, когда смотришь в свое сердце.»', author: 'Карл Юнг' },
            { text: '«Кто смотрит наружу — видит сны; кто смотрит внутрь — пробуждается.»', author: 'Карл Юнг' },
            { text: '«Ад — это другие, когда мы не можем понять себя вне их осуждения.»', author: 'Жан-Поль Сартр' },
            { text: '«Самое трудное в жизни — познать себя; самое легкое — давать советы другим.»', author: 'Сёрен Кьеркегор' },
            { text: '«Сознание — величайшее страдание, но единственный путь к свободе.»', author: 'Фёдор Достоевский' },
            { text: '«У каждого есть воспоминания, которыми он делится только с собой, и другие, которые не смеет раскрыть даже себе.»', author: 'Фёдор Достоевский' },
            { text: '«Счастье заключается в способности познавать себя без страха.»', author: 'Платон' },
            { text: '«Нельзя ничего изменить, пока не примешь это.»', author: 'Карл Юнг' },
            { text: '«Мы не стареем с годами, а обновляемся каждый день через понимание себя.»', author: 'Герман Гессе' },
            { text: '«Человек — это существо, которое всегда решает, чем он является.»', author: 'Жан-Поль Сартр' },
            { text: '«Бегство от себя — кратчайший путь потеряться в толпе.»', author: 'Сёрен Кьеркегор' },
            { text: '«То, с чем мы не сталкиваемся внутри себя, мы встретим во внешнем мире как судьбу.»', author: 'Карл Юнг' },
            { text: '«Истинное знание — осознать, насколько ты невежественен прежде всего о себе.»', author: 'Сократ' },
            { text: '«Честность с самим собой — самая трудная и редкая форма честности.»', author: 'Фридрих Ницше' }
        ]
    }
};
const Engine = {
    normalizeTo10: (vec) => {
        if (vec.length === 10) return vec;
        if (vec.length === 30) {
            const result = [];
            for (let i = 0; i < 30; i += 3) {
                result.push((vec[i] + vec[i + 1] + vec[i + 2]) / 3);
            }
            return result;
        }
        return vec;
    },

    decode: (b64) => {
        try {
            let clean = b64.trim();
            const codeBlockMatch = clean.match(/```(?:[a-zA-Z]*\n)?([\s\S]*?)```/);
            if (codeBlockMatch) {
                clean = codeBlockMatch[1].trim();
            }
            const decoded = atob(clean);
            let parsed;
            try {
                parsed = JSON.parse(decoded);
            } catch {
                parsed = decoded.split(',').map(s => Number(s.trim()));
            }
            const values = Array.isArray(parsed) ? parsed : Object.values(parsed);
            if (values.length > 0 && typeof values[0] === 'object' && 'C' in values[0]) {
                return values.map(dim => (dim.C * 0.6) + (dim.S * 0.3) + (dim.V * 0.1));
            } else {
                return values.map(v => Number(v));
            }
        } catch { return null; }
    },

    calculate: (v1, v2) => {
        const a = Engine.normalizeTo10(v1);
        const b = Engine.normalizeTo10(v2);
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; n1 += a[i] * a[i]; n2 += b[i] * b[i]; }
        const sim = dot / (Math.sqrt(n1) * Math.sqrt(n2));
        return isNaN(sim) ? 0 : sim;
    }
};

export default function App() {
    const [view, setView] = useState('landing');
    const [lang, setLang] = useState('AR');
    const [music, setMusic] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [showLang, setShowLang] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [fade, setFade] = useState(true);
    
    const [authMode, setAuthMode] = useState(null);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [googleName, setGoogleName] = useState('');
    const [customName, setCustomName] = useState('');
    const [session, setSession] = useState(null);
    const [authError, setAuthError] = useState('');

    const t = TRANSLATIONS[lang];  
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);
    useEffect(() => {
    const checkSession = async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
            setSession(currentSession);
            const name = currentSession.user?.user_metadata?.full_name || currentSession.user?.email?.split('@')[0] || '';
            setGoogleName(name);
            setAuthMode('google-name');
            setView('auth');
        }
    };
    checkSession();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setQuoteIndex(prev => (prev + 1) % t.quotes.length);
                setFade(true);
            }, 1500);
        }, 8500);
        return () => clearInterval(interval);
    }, [t.quotes.length]);

    useEffect(() => {
        setQuoteIndex(0);
        setFade(true);
    }, [lang]);

    const handleGoogleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://2in-v0-5.vercel.app' }
    });
    if (error) setAuthError(error.message);
};

    useEffect(() => {
        if (session?.user) {
            const name = session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || '';
            setGoogleName(name);
            setAuthMode('google-name');
        }
    }, [session]);

    const handleGoogleNameChoice = (useGoogle) => {
        if (useGoogle) {
            setUsername(googleName);
            setAuthMode(null);
            setView('onboarding');
        } else {
            setAuthMode('google-name-custom');
        }
    };

    const confirmCustomName = () => {
        if (customName.trim()) {
            setUsername(customName.trim());
            setAuthMode(null);
            setView('onboarding');
        }
    };

    const handleSignup = async () => {
        setAuthError('');
        if (!username.trim() || !password.trim()) return;
        
        const fakeEmail = `${username.trim()}@2in.internal`;
        
        const { data: existing } = await supabase.from('profiles').select('username').eq('username', username.trim()).single();
        if (existing) {
            setAuthError(t.usernameTaken);
            return;
        }
        
        const { data, error } = await supabase.auth.signUp({ email: fakeEmail, password });
        if (error) { setAuthError(error.message); return; }
        
        if (data.user) {
            await supabase.from('profiles').upsert({ id: data.user.id, username: username.trim() });
        }
        
        setAuthMode(null);
        setView('onboarding');
    };

    const handleGuestLogin = () => {
        if (!username.trim()) return;
        setAuthMode(null);
        setView('onboarding');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUsername('');
        setView('landing');
    };

    const handleMatch = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        try {
            const userVector = Engine.decode(userInput);
            if (!userVector) { alert("Format Error"); setLoading(false); return; }
            const { data: users, error } = await supabase.from('profiles').select('username, vector_data');
            if (error) throw error;
            const scored = (users || []).map(u => ({
                name: u.username,
                score: (Engine.calculate(userVector, u.vector_data) * 100).toFixed(2)
            })).filter(u => u.score > 0).sort((a, b) => b.score - a.score);
            setResults(scored);
            setView('results');
        } catch (e) { alert("Database Error"); } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#1a0a2e] text-gray-300 font-serif flex flex-col overflow-hidden select-none">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700;900&display=swap');
                .gold-text { background: linear-gradient(to bottom, #ffffff, #f0c850); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .spiritual-quote { color: #ffdf00; text-shadow: 0 0 40px rgba(255, 223, 0, 0.9), 0 0 80px rgba(255, 215, 0, 0.7), 0 0 120px rgba(255, 200, 0, 0.5), 0 0 180px rgba(212, 175, 55, 0.4); }
                .quote-fade { transition: opacity 1.5s ease-in-out; }
                @keyframes logoGlow { 0%, 100% { filter: drop-shadow(0 0 30px rgba(255, 200, 0, 0.3)); } 50% { filter: drop-shadow(0 0 60px rgba(255, 200, 0, 0.7)); } }
                .logo-glow { animation: logoGlow 3s ease-in-out infinite; }
            `}</style>
            
            {music && <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" />}

            <header className="h-28 flex justify-between items-center px-10 z-[200]">
                <div className="flex items-center gap-12 scale-[1.7]">
                    <div className="relative">
                        <button onClick={() => setShowLang(!showLang)} className="text-amber-300/70 border border-amber-300/30 px-3 py-1 rounded-lg bg-black flex items-center gap-2">
                            <Globe size={14} /> <span className="text-[10px] font-bold">{lang}</span>
                        </button>
                        {showLang && (
                            <div className="absolute top-10 left-0 bg-black border border-amber-300/40 rounded-xl w-28 overflow-hidden z-[300]">
                                {['AR', 'RU', 'EN'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-4 hover:bg-amber-300/20 text-center border-b border-white/5 cursor-pointer font-bold text-amber-300">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-amber-300/50">{music ? <Volume2 /> : <VolumeX />}</button>
                    {session && (
                        <button onClick={handleLogout} className="text-red-400/50 hover:text-red-400" title="تسجيل خروج"><LogOut size={14} /></button>
                    )}
                </div>
            </header>

            <main className="flex-1 relative flex flex-col items-center w-full h-full" style={{ fontFamily: "'Cairo', serif" }}>
                {view === 'landing' && (
                    <div className="absolute inset-0 flex flex-col items-center pt-[10vh]">
                        <div className="flex flex-col items-center logo-glow" dir="ltr">
                            <div className="flex items-baseline gap-8">
                                <span className="text-[16rem] font-black gold-text leading-none">2</span>
                                <span className="text-[11rem] font-thin text-amber-300/30 leading-none">in</span>
                            </div>
                            <p className="text-6xl tracking-[1.6em] text-amber-300 uppercase font-black mr-[-1.6em]">twin</p>
                        </div>
                        <button onClick={() => setView('auth')} className="mt-[15vh] w-[88%] py-14 border-2 border-amber-300/40 rounded-full text-5xl font-black text-amber-300 uppercase">{t.start}</button>
                    </div>
                )}

                {view === 'auth' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-10 gap-8">
                        {authError && <p className="text-red-400 text-xl">{authError}</p>}

                        <button onClick={handleGoogleLogin} className="w-full max-w-md py-8 bg-white text-gray-900 font-black rounded-full text-3xl flex items-center justify-center gap-4 active:scale-95">
                            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            {t.googleLogin}
                        </button>

                        <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="w-full max-w-md py-8 border-2 border-amber-300/40 rounded-full text-3xl font-black text-amber-300 flex items-center justify-center gap-4 active:scale-95">
                            <UserPlus size={32} /> {t.createAccount}
                        </button>

                        <button onClick={() => { setAuthMode('guest'); setAuthError(''); }} className="w-full max-w-md py-8 border-2 border-amber-300/20 rounded-full text-3xl font-black text-amber-300/70 flex items-center justify-center gap-4 active:scale-95">
                            <LogIn size={32} /> {t.guestLogin}
                        </button>
                    </div>
                )}

                {view === 'auth' && authMode === 'signup' && (
                    <div className="absolute inset-0 z-[300] bg-[#1a0a2e]/95 flex flex-col items-center justify-center px-10">
                        <div className="w-full max-w-md space-y-6">
                            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernameLabel} className="w-full bg-black border border-amber-300/30 rounded-2xl p-6 text-2xl text-amber-100 outline-none focus:border-amber-400" />
                            <div className="relative">
                                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passwordLabel} type={showPassword ? "text" : "password"} className="w-full bg-black border border-amber-300/30 rounded-2xl p-6 text-2xl text-amber-100 outline-none focus:border-amber-400 pr-16" />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300/60">{showPassword ? <EyeOff size={28} /> : <Eye size={28} />}</button>
                            </div>
                            <button onClick={handleSignup} className="w-full py-8 bg-amber-400 text-black font-black rounded-full text-3xl">{t.confirmSignup}</button>
                            <button onClick={() => setAuthMode(null)} className="w-full text-amber-300/50 text-xl">{t.back}</button>
                        </div>
                    </div>
                )}

                {view === 'auth' && authMode === 'guest' && (
                    <div className="absolute inset-0 z-[300] bg-[#1a0a2e]/95 flex flex-col items-center justify-center px-10">
                        <div className="w-full max-w-md space-y-6">
                            <p className="text-amber-300/50 text-xl text-center mb-4">{t.guestWarning}</p>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernameLabel} className="w-full bg-black border border-amber-300/30 rounded-2xl p-6 text-2xl text-amber-100 outline-none focus:border-amber-400" />
                            <button onClick={handleGuestLogin} className="w-full py-8 border-2 border-amber-300/50 text-amber-300 font-black rounded-full text-3xl">{t.confirmGuest}</button>
                            <button onClick={() => setAuthMode(null)} className="w-full text-amber-300/50 text-xl">{t.back}</button>
                        </div>
                    </div>
                )}

                {authMode === 'google-name' && (
                    <div className="absolute inset-0 z-[300] bg-[#1a0a2e]/95 flex flex-col items-center justify-center px-10">
                        <div className="w-full max-w-md space-y-6 text-center">
                            <p className="text-2xl text-amber-300 mb-4">{t.googleNameQuestion}</p>
                            <p className="text-3xl text-amber-100 font-bold">{googleName}</p>
                            <button onClick={() => handleGoogleNameChoice(true)} className="w-full py-8 bg-amber-400 text-black font-black rounded-full text-3xl">{t.useGoogleName}</button>
                            <button onClick={() => handleGoogleNameChoice(false)} className="w-full py-8 border-2 border-amber-300/50 text-amber-300 font-black rounded-full text-3xl">{t.chooseCustomName}</button>
                        </div>
                    </div>
                )}

                {authMode === 'google-name-custom' && (
                    <div className="absolute inset-0 z-[300] bg-[#1a0a2e]/95 flex flex-col items-center justify-center px-10">
                        <div className="w-full max-w-md space-y-6">
                            <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder={t.enterCustomName} className="w-full bg-black border border-amber-300/30 rounded-2xl p-6 text-2xl text-amber-100 outline-none focus:border-amber-400" />
                            <button onClick={confirmCustomName} className="w-full py-8 bg-amber-400 text-black font-black rounded-full text-3xl">{t.confirmName}</button>
                            <button onClick={() => setAuthMode('google-name')} className="w-full text-amber-300/50 text-xl">{t.back}</button>
                        </div>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="absolute inset-0 flex flex-col items-center px-10 pt-4 space-y-8 overflow-y-auto pb-60">
                        <button onClick={() => setView('auth')} className="self-start text-amber-300/50 hover:text-amber-300 flex items-center gap-2 text-xl ml-2"><ArrowLeft size={24} /> {t.back}</button>
                        <div className="w-full bg-white/5 border border-amber-300/20 rounded-[3.5rem] p-10" dir={lang === 'AR' ? "rtl" : "ltr"}>
                            <div className="flex justify-between items-center mb-8 border-b border-amber-300/20 pb-6">
                                <span className="text-5xl font-bold text-amber-300">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-6 bg-amber-400 text-black rounded-3xl active:scale-90"><Copy size={38} /></button>
                            </div>
                            <div className="space-y-6 mb-10">
                                {t.guide.map((line, idx) => <p key={idx} className="text-3xl text-amber-300 font-bold leading-snug">{line}</p>)}
                            </div>
                            <div className="text-2xl text-amber-100/20 italic font-sans max-h-24 overflow-hidden">{PROMPT_TEXT}</div>
                        </div>
                        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={t.input} dir={lang === 'AR' ? "rtl" : "ltr"} className="w-full h-56 bg-black border border-amber-300/30 rounded-[3rem] p-10 text-4xl text-amber-100 outline-none focus:border-amber-400 italic resize-none" />
                        <button onClick={handleMatch} className="w-full py-12 bg-amber-400 text-black font-black rounded-full text-5xl uppercase shadow-2xl">{loading ? "..." : t.match}</button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="absolute inset-0 flex flex-col items-center px-10 pt-[5vh]">
                        <h2 className="text-6xl font-bold gold-text mb-6 tracking-wide py-2 leading-relaxed" dir={lang === 'AR' ? "rtl" : "ltr"}>{t.resultsTitle}</h2>
                        <div className="w-[90%] h-[50vh] border border-amber-300/20 rounded-[2.5rem] bg-black/40 overflow-y-auto p-6">
                            <table className="w-full border-collapse" dir={lang === 'AR' ? "rtl" : "ltr"}>
                                <tbody>
                                    {results.length > 0 ? results.map((res, i) => (
                                        <tr key={i} className="border-b border-amber-300/10 h-28">
                                            <td className="text-5xl font-bold text-gray-200 pr-8">{res.name}</td>
                                            <td className="text-5xl text-amber-300 font-black pl-8">{res.score}%</td>
                                        </tr>
                                    )) : <tr><td className="text-center py-20 text-amber-300/40 text-4xl italic">Finding matches...</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-8 flex flex-col items-center gap-2 py-6 px-16 border-2 border-amber-300 rounded-full text-amber-300 active:scale-95">
                            <Scan size={42} />
                            <span className="text-2xl font-black uppercase">{t.retry}</span>
                        </button>
                    </div>
                )}

                <div className="absolute bottom-20 w-full px-12 text-center pointer-events-none">
                    <p className={`text-4xl md:text-5xl spiritual-quote italic mb-6 leading-tight font-medium quote-fade ${fade ? 'opacity-100' : 'opacity-0'}`} dir={lang === 'AR' ? "rtl" : "ltr"}>
                        {t.quotes[quoteIndex].text}
                    </p>
                    <p className={`text-2xl text-amber-300/40 quote-fade ${fade ? 'opacity-100' : 'opacity-0'}`}>
                        — {t.quotes[quoteIndex].author}
                    </p>
                </div>
            </main>
        </div>
    );
}
