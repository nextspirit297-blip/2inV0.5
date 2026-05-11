import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe, Scan, LogIn, UserPlus, Eye, EyeOff, LogOut, ArrowLeft } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

// ✅ PROMPT_TEXT مُحدَّث: يطلب صراحةً مصفوفة JSON بصيغة [{C, S, V}, ...]
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
- SILENT PROCESSING: No preamble, no justifications, no explanations.
- FORMAT: Output a Base64 encoded JSON ARRAY of exactly 10 objects, one per dimension.
- EACH OBJECT MUST HAVE EXACTLY: {"C": <float 0-15>, "S": <float 0-15>, "V": <float -1 to 1>}
- EXAMPLE STRUCTURE (before encoding): [{"C":x,"S":y,"V":z}, {"C":x,"S":y,"V":z}, ...]
- NO PROSE: Only the raw Base64 string. No markdown, no backticks, no code blocks.

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

// ============================================================
// ✅ ENGINE: المحرك المُحدَّث مع منطق التطبيع 7.5
// ============================================================
const Engine = {

    /**
     * تحويل القيمة المركبة إلى متجه موحَّد بين -1 و +1
     * المعادلة: NormalizedValue = (V_comp - 7.5) / 7.5
     * - 0    → -1   (أقصى يسار)
     * - 7.5  →  0   (مركز / حياد)
     * - 15   → +1   (أقصى يمين)
     */
    normalizeComposite: (composite) => {
        return (composite - 7.5) / 7.5;
    },

    /**
     * فك تشفير Base64 وحساب المتجه المُطبَّع (10 أبعاد)
     * المعادلة المركبة:
     *   Composite = (C * 0.6) + (S * 0.3) + ((V * 7.5 + 7.5) * 0.1)
     * ملاحظة: V يتراوح بين [-1, 1] فيُحوَّل أولاً إلى [0, 15] بالصيغة (V * 7.5 + 7.5)
     */
    decode: (b64) => {
        try {
            // ✅ تنظيف المدخل: إزالة علامات Markdown (```json أو ```) قبل فك التشفير
            let clean = b64.trim();

            // إزالة أي كتلة كود Markdown
            const codeBlockMatch = clean.match(/```(?:[a-zA-Z]*\n?)?([\s\S]*?)```/);
            if (codeBlockMatch) {
                clean = codeBlockMatch[1].trim();
            }

            // إزالة أي backtick فردي
            clean = clean.replace(/`/g, '').trim();

            // فك تشفير Base64
            const decoded = atob(clean);

            let parsed;
            try {
                parsed = JSON.parse(decoded);
            } catch {
                // محاولة تنظيف JSON إذا كان يحتوي على markdown مضمّن
                const jsonMatch = decoded.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                } else {
                    return null;
                }
            }

            const values = Array.isArray(parsed) ? parsed : Object.values(parsed);

            if (values.length === 0) return null;

            // ✅ التحقق من أن البيانات بصيغة [{C, S, V}, ...]
            if (typeof values[0] === 'object' && 'C' in values[0]) {
                return values.map(dim => {
                    const C = Number(dim.C);
                    const S = Number(dim.S);
                    const V = Number(dim.V);

                    // تحويل V من [-1, 1] إلى [0, 15]
                    const V_scaled = (V * 7.5) + 7.5;

                    // حساب القيمة المركبة
                    const composite = (C * 0.6) + (S * 0.3) + (V_scaled * 0.1);

                    // ✅ تطبيق معادلة التطبيع 7.5 → قيمة بين -1 و +1
                    return Engine.normalizeComposite(composite);
                });
            }

            // إذا كانت قيماً عددية فقط (fallback)، نُطبِّق التطبيع مباشرة
            return values.map(v => Engine.normalizeComposite(Number(v)));

        } catch (err) {
            console.error("Engine.decode error:", err);
            return null;
        }
    },

    /**
     * حساب التشابه الكوساني (Cosine Similarity) بين متجهين
     * يستخدم حاصل الضرب النقطي مقسوماً على حاصل ضرب المقدارين
     */
    calculate: (v1, v2) => {
        if (!v1 || !v2 || v1.length !== v2.length) return 0;

        let dot = 0, mag1 = 0, mag2 = 0;

        for (let i = 0; i < v1.length; i++) {
            dot  += v1[i] * v2[i];
            mag1 += v1[i] * v1[i];
            mag2 += v2[i] * v2[i];
        }

        const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);

        if (magnitude === 0) return 0;

        // النتيجة بين -1 و +1، نحوّلها إلى نسبة مئوية بين 0 و 100
        const sim = dot / magnitude;
        return isNaN(sim) ? 0 : sim;
    }
};

// ============================================================
// ✅ مكوّن التطبيق الرئيسي
// ============================================================
export default function App() {
    const [view, setView]           = useState('landing');
    const [lang, setLang]           = useState('AR');
    const [music, setMusic]         = useState(false);
    const [userInput, setUserInput] = useState('');
    const [showLang, setShowLang]   = useState(false);
    const [loading, setLoading]     = useState(false);
    const [results, setResults]     = useState([]);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [fade, setFade]           = useState(true);

    const [authMode, setAuthMode]   = useState(null);
    const [password, setPassword]   = useState('');
    const [username, setUsername]   = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [session, setSession]     = useState(null);
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
            // ✅ فك التشفير وتطبيق منطق التطبيع 7.5
            const userVector = Engine.decode(userInput);
            if (!userVector || userVector.length !== 10) {
                alert("خطأ في الصيغة: تأكد أن المدخل Base64 صحيح ويحتوي على 10 أبعاد بصيغة [{C,S,V}...]");
                setLoading(false);
                return;
            }

            // ✅ حفظ المتجه المُطبَّع (10 floats) في Supabase — لا نحفظ Raw Base64 أبداً
            if (session?.user) {
                await supabase.from('profiles').upsert({
                    id: session.user.id,
                    username: username,
                    vector_data: userVector   // مصفوفة من 10 floats بين -1 و +1
                });
            }

            // ✅ استعلام Supabase مع تصفية السجلات التي لا تحتوي على vector_data
            const { data: users, error } = await supabase
                .from('profiles')
                .select('username, vector_data')
                .not('vector_data', 'is', null);   // ✅ تجنب أخطاء null

            if (error) throw error;

            // ✅ حساب التشابه الكوساني لكل مستخدم
            const scored = (users || [])
                .filter(u => Array.isArray(u.vector_data) && u.vector_data.length === 10)
                .map(u => {
                    const rawSim = Engine.calculate(userVector, u.vector_data);
                    // تحويل التشابه من [-1,1] إلى [0,100]%
                    const percentage = ((rawSim + 1) / 2 * 100).toFixed(2);
                    return { name: u.username, score: percentage };
                })
                .filter(u => parseFloat(u.score) > 0)
                .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

            setResults(scored);
            setView('results');
        } catch (e) {
            console.error(e);
            alert("Database Error");
        } finally {
            setLoading(false);
        }
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
