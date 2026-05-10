import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, Scan, LogIn, UserPlus, Eye, EyeOff, LogOut, ArrowLeft } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const PROMPT_TEXT = `ACT AS A "DEEP PSYCHOLOGICAL SPECTRAL ENGINE" (DPSE).

You are analyzing a human being through 16 fundamental psychological dimensions mapped to established personality theories (Five-Factor Model, HEXACO, Self-Determination Theory, Existential Psychology, and Ego Development theory). Each dimension has three layers:
- CORE (C): Conscious identity / baseline trait (0.00 - 15.00)
- SHADOW (S): Suppressed/latent counter-trait or stress response (0.00 - 15.00)
- VELOCITY (V): Growth direction and rate (-1.00 to +1.00)

DIMENSIONS TO ANALYZE:
1. Openness to Experience - C: intellectual curiosity, S: fear of unknown, V: cognitive flexibility
2. Conscientiousness - C: self-discipline, S: rigidity/obsessiveness, V: adaptation capacity
3. Extraversion - C: social energy, S: attention-seeking/emptiness, V: social flexibility
4. Agreeableness - C: empathy/cooperation, S: conflict avoidance/resentment, V: assertiveness growth
5. Neuroticism - C: emotional sensitivity, S: anxiety/dread, V: emotional regulation
6. Honesty-Humility - C: sincerity/fairness, S: hidden selfishness, V: ethical development
7. Cognitive Processing - C: analytical depth, S: overthinking/paralysis, V: thinking flexibility
8. Emotional Processing - C: emotional awareness, S: emotional overwhelm, V: emotional intelligence
9. Temporal Orientation - C: future-planning, S: past-rumination, V: presence-development
10. Meaning-Making - C: existential depth, S: nihilistic despair, V: wisdom growth
11. Self-Concept Clarity - C: self-knowledge, S: self-deception, V: self-actualization
12. Resilience - C: coping ability, S: fragile defenses, V: anti-fragility development
13. Creativity - C: original thinking, S: chaos/disorganization, V: creative evolution
14. Social Cognition - C: understanding others, S: paranoia/mistrust, V: social wisdom
15. Motivation Structure - C: intrinsic drive, S: fear-based motivation, V: autonomy development
16. Integration/Synthesis - C: psychological wholeness, S: fragmentation, V: integration growth

STRICT OUTPUT RULES - FOLLOW EXACTLY:
1. NO introduction, NO explanation, NO analysis, NO summary
2. NO greetings, NO comments, NO notes, NO markdown (except the code block)
3. Output ONLY a JSON object with keys "1" through "16", each containing {"C":X,"S":X,"V":X}
4. Base64 encode that JSON object
5. Place ONLY the Base64 string inside a markdown code block
6. The code block must contain the Base64 string and NOTHING ELSE

EXAMPLE OF CORRECT OUTPUT:
```<Base64_String_Here>```

WRONG: Any text before/after the code block
WRONG: JSON not Base64 encoded
WRONG: Missing dimensions

EXECUTE FULL SPECTRAL ANALYSIS NOW.`;

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
        login: "تسجيل الدخول",
        confirmLogin: "تأكيد تسجيل الدخول",
        createAccount: "إنشاء حساب",
        guestLogin: "الدخول كضيف",
        guestWarning: "ملاحظة: الدخول كضيف لا يسمح باسترجاع بياناتك أو رسائلك مستقبلاً بعد تسجيل الخروج.",
        usernameLabel: "اسم المستخدم",
        passwordLabel: "كلمة المرور",
        usernameTaken: "اسم المستخدم مستخدم من قبل",
        confirmSignup: "تأكيد إنشاء الحساب",
        confirmGuest: "تأكيد الدخول كضيف",
        back: "رجوع",
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
        login: "Sign In",
        confirmLogin: "Confirm Sign In",
        createAccount: "Create Account",
        guestLogin: "Continue as Guest",
        guestWarning: "Note: Guest mode does not allow data recovery after logout.",
        usernameLabel: "Username",
        passwordLabel: "Password",
        usernameTaken: "Username already taken",
        confirmSignup: "Confirm Sign Up",
        confirmGuest: "Confirm Guest Entry",
        back: "Back",
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
        login: "Войти",
        confirmLogin: "Подтвердить вход",
        createAccount: "Создать аккаунт",
        guestLogin: "Продолжить как гость",
        guestWarning: "Примечание: Гостевой режим не позволяет восстановить данные после выхода.",
        usernameLabel: "Имя пользователя",
        passwordLabel: "Пароль",
        usernameTaken: "Имя пользователя уже занято",
        confirmSignup: "Подтвердить регистрацию",
        confirmGuest: "Подтвердить вход как гость",
        back: "Назад",
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

  decode: (b64) => {
    try {
        let clean = b64.trim();
        // Extract from markdown if present
        const m = clean.match(/```[\s\S]*?\n([\s\S]*?)```/);
        if (m) clean = m[1].trim();
        // Decode Base64
        const json = JSON.parse(atob(clean));
        const dims = Object.values(json);
        if (dims.length > 0 && typeof dims[0] === 'object') {
            return dims.map(d => {
                const C = d.C || 7.5;
                const S = d.S || 7.5;
                const V = d.V || d.v || 0;
                return (C * 0.6) + (S * 0.3) + (V * 0.1);
            });
        }
        if (Array.isArray(dims) && dims.length > 0 && typeof dims[0] === 'number') {
            return dims;
        }
        return null;
    } catch { return null; }
},

    calculate: (a, b) => {
    if (!a || !b || a.length !== b.length) return 0;
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    const sim = dot / (Math.sqrt(na) * Math.sqrt(nb));
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

const handleLogin = async () => {
    setAuthError('');
    if (!username.trim() || !password.trim()) return;
    const fakeEmail = `${username.trim()}@2in.internal`;
    const { data, error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password });
    if (error) { setAuthError("خطأ في اسم المستخدم أو كلمة المرور"); return; }
    if (data.user) setUsername(username.trim());
    setAuthMode(null);
    setView('onboarding');
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
        if (!userVector) { alert("فشل فك التشفير"); setLoading(false); return; }
        
        // حفظ البصمة إذا مسجل دخول
        if (session?.user) {
            await supabase.from('profiles').upsert({ 
                id: session.user.id, 
                username: username,
                vector_data: userVector 
            });
        }
        
        // جلب الجميع
        const { data: allUsers, error } = await supabase.from('profiles').select('id, username, vector_data');
        if (error) throw error;

        let message = `بصمتك (${userVector.length} أبعاد): ${JSON.stringify(userVector.slice(0, 3))}...\n\n`;
        
        const others = (allUsers || []).filter(u => u.vector_data && u.id !== session?.user?.id);
        
        if (others.length === 0) {
            message += "لا يوجد مستخدمين آخرين للمقارنة.";
        } else {
            for (let u of others) {
                const v = u.vector_data;
                const score = (Engine.calculate(userVector, v) * 100).toFixed(2);
                message += `${u.username}: ${v.length} أبعاد, تطابق ${score}%\n`;
            }
        }
        
        alert(message);
        setResults([]);
        setView('results');
    } catch (e) { alert("خطأ: " + e.message); } finally { setLoading(false); }
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

                    <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="w-full max-w-md py-8 border-2 border-amber-300/40 rounded-full text-3xl font-black text-amber-300 flex items-center justify-center gap-4 active:scale-95">
                        <LogIn size={32} /> {t.login}
                    </button>

                    <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="w-full max-w-md py-8 border-2 border-amber-300/40 rounded-full text-3xl font-black text-amber-300 flex items-center justify-center gap-4 active:scale-95">
                        <UserPlus size={32} /> {t.createAccount}
                    </button>

                    <button onClick={() => { setAuthMode('guest'); setAuthError(''); }} className="w-full max-w-md py-8 border-2 border-amber-300/20 rounded-full text-3xl font-black text-amber-300/70 flex items-center justify-center gap-4 active:scale-95">
                        <LogIn size={32} /> {t.guestLogin}
                    </button>
                </div>
            )}

            {view === 'auth' && authMode === 'login' && (
                <div className="absolute inset-0 z-[300] bg-[#1a0a2e]/95 flex flex-col items-center justify-center px-10">
                    <div className="w-full max-w-md space-y-6">
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernameLabel} className="w-full bg-black border border-amber-300/30 rounded-2xl p-6 text-2xl text-amber-100 outline-none focus:border-amber-400" />
                        <div className="relative">
                            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passwordLabel} type={showPassword ? "text" : "password"} className="w-full bg-black border border-amber-300/30 rounded-2xl p-6 text-2xl text-amber-100 outline-none focus:border-amber-400 pr-16" />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300/60">{showPassword ? <EyeOff size={28} /> : <Eye size={28} />}</button>
                        </div>
                        <button onClick={handleLogin} className="w-full py-8 bg-amber-400 text-black font-black rounded-full text-3xl">{t.confirmLogin}</button>
                        <button onClick={() => setAuthMode(null)} className="w-full text-amber-300/50 text-xl">{t.back}</button>
                    </div>
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
