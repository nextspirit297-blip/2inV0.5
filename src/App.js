import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, VolumeX, Copy, Globe } from 'lucide-react';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const PROMPT_TEXT = `ACT AS A "HIGH-RESOLUTION PSYCHOLOGICAL VECTOR ENGINE" (HRPVE).
OPERATIONAL LOGIC:
Every dimension is a bipolar continuum.
Value 0.00: Represents the absolute extremity of the Left Pole.
Value 7.50: Represents the Neutral Point (Balance or Absence of Lean).
Value 15.00: Represents the absolute extremity of the Right Pole.
DIMENSIONS & BIPOLAR POLES:
Evaluate the subject on these 30 axes:
Cognition: Intuitive/Surface \leftrightarrow Deep Analytical
Empathy: Detached/Clinical \leftrightarrow Hyper-Resonant
Philosophy: Materialist/Pragmatic \leftrightarrow Existential/Idealist
Risk: Extreme Aversion \leftrightarrow High Appetite
Reasoning: Concrete/Literal \leftrightarrow Highly Abstract
Execution: Theoretical/Dreamer \leftrightarrow Pragmatic/Doer
Creativity: Derivative/Standard \leftrightarrow Radical Synthesis
Stability: Volatile/Reactive \leftrightarrow Stoic/Constant
Curiosity: Satisfied/Closed \leftrightarrow Relentless Inquiry
Social: Solitary/Recluse \leftrightarrow Hyper-Connected
Order: Spontaneous/Chaotic \leftrightarrow Rigidly Conscientious
Anxiety: Content/Secure \leftrightarrow Deep Existential Dread
Systems: Reductionist \leftrightarrow Holistic/Systemic
Change: Rigid/Static \leftrightarrow Fluid/Adaptable
Aesthetics: Utilitarian \leftrightarrow Highly Sensitive/Artistic
Altruism: Ego-Centric \leftrightarrow Radical Selflessness
Skepticism: Credulous/Trusting \leftrightarrow Radical Doubt
Time (Future): Present-Locked \leftrightarrow Visionary/Future-Oriented
Time (Past): Ahistorical \leftrightarrow Deep Historical Consciousness
Control: Impulsive \leftrightarrow Disciplined Self-Regulation
Logic: Linear/Mechanical \leftrightarrow Nonlinear/Intuitive
Power: Submissive/Passive \leftrightarrow Dominant/Assertive
Openness: Traditional/Guarded \leftrightarrow Boundless Exploration
Morality: Situational/Flexible \leftrightarrow Absolute/Moral Rigidity
Strategy: Reactive/Tactical \leftrightarrow Grand Strategic Foresight
Reflection: Externalized \leftrightarrow Deeply Introspective
Agency: Dependent/Follower \leftrightarrow Total Autonomy
Patterns: Noise-Blind \leftrightarrow Acute Pattern Recognition
Resilience: Fragile \leftrightarrow Anti-Fragile/Resilient
Ambiguity: Need for Certainty \leftrightarrow High Ambiguity Tolerance
OUTPUT REQUIREMENTS:
The Analysis: Justify each score based on linguistic and psychological evidence.
The Vector: A raw array [v1, v2...v30].
The Fingerprint: ONLY the Base64-encoded string of the array`;

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
        quotes: [{ text: "«لم يكن هدفي سوى محاولة أن أحيا وفقاً للدوافع التي تنبع من ذاتي الحقيقية، فلماذا كان ذلك بتلك الصعوبة؟»", author: "هيرمان هسه" }]
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
        quotes: [{ text: "«Моей целью было лишь жить в соответствии с импульсами моего истинного я.»", author: "Герман Гессе" }]
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
        quotes: [{ text: "«My goal was only to live in accordance with the impulses from my true self.»", author: "Hermann Hesse" }]
    }
};

const Engine = {
    decode: (b64) => { 
        try { return JSON.parse(atob(b64.trim())).map(v => (v - 7.5) / 7.5); } catch { return null; } 
    },
    calculate: (v1, v2) => {
        let dot = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < 30; i++) { dot += v1[i] * v2[i]; n1 += v1[i] * v1[i]; n2 += v2[i] * v2[i]; }
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

    const t = TRANSLATIONS[lang];

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
        <div className="fixed inset-0 w-full h-full bg-[#020202] text-gray-300 font-serif flex flex-col overflow-hidden select-none">
            <style>{`.gold-text { background: linear-gradient(to bottom, #ffffff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } .spiritual-quote { color: #ffd700; text-shadow: 0 0 25px rgba(212, 175, 55, 0.4); }`}</style>
            
            {music && <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" />}

            <header className="h-28 flex justify-between items-center px-10 z-[200]">
                <div className="flex items-center gap-12 scale-[1.7]">
                    <div className="relative">
                        <button onClick={() => setShowLang(!showLang)} className="text-yellow-600/70 border border-yellow-600/30 px-3 py-1 rounded-lg bg-black flex items-center gap-2">
                            <Globe size={14} /> <span className="text-[10px] font-bold">{lang}</span>
                        </button>
                        {showLang && (
                            <div className="absolute top-10 left-0 bg-black border border-yellow-600/40 rounded-xl w-28 overflow-hidden z-[300]">
                                {['AR', 'RU', 'EN'].map(l => (
                                    <div key={l} onClick={() => { setLang(l); setShowLang(false); }} className="p-4 hover:bg-yellow-600/20 text-center border-b border-white/5 cursor-pointer font-bold">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-yellow-600/50">{music ? <Volume2 /> : <VolumeX />}</button>
                </div>
            </header>

            <main className="flex-1 relative flex flex-col items-center w-full h-full">
                {view === 'landing' && (
                    <div className="absolute inset-0 flex flex-col items-center pt-[10vh]">
                        <div className="flex flex-col items-center" dir="ltr">
                            <div className="flex items-baseline gap-8">
                                <span className="text-[16rem] font-black gold-text leading-none">2</span>
                                <span className="text-[11rem] font-thin text-yellow-600/30 leading-none">in</span>
                            </div>
                            <p className="text-6xl tracking-[1.6em] text-yellow-500 uppercase font-black mr-[-1.6em]">twin</p>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-[15vh] w-[88%] py-14 border-2 border-yellow-600/40 rounded-full text-5xl font-black text-yellow-500 uppercase">{t.start}</button>
                    </div>
                )}

                {view === 'onboarding' && (
                    <div className="absolute inset-0 flex flex-col items-center px-10 pt-4 space-y-8 overflow-y-auto pb-60">
                        <div className="w-full bg-white/5 border border-yellow-900/20 rounded-[3.5rem] p-10" dir={lang === 'AR' ? "rtl" : "ltr"}>
                            <div className="flex justify-between items-center mb-8 border-b border-yellow-900/20 pb-6">
                                <span className="text-5xl font-bold text-yellow-500">{t.promptTitle}</span>
                                <button onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)} className="p-6 bg-yellow-600 text-black rounded-3xl active:scale-90"><Copy size={38} /></button>
                            </div>
                            <div className="space-y-6 mb-10">
                                {t.guide.map((line, idx) => <p key={idx} className="text-3xl text-yellow-600 font-bold leading-snug">{line}</p>)}
                            </div>
                            <div className="text-2xl text-yellow-100/20 italic font-sans max-h-24 overflow-hidden">{PROMPT_TEXT}</div>
                        </div>
                        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={t.input} dir={lang === 'AR' ? "rtl" : "ltr"} className="w-full h-56 bg-black border border-yellow-900/30 rounded-[3rem] p-10 text-4xl text-yellow-100 outline-none focus:border-yellow-600 italic resize-none" />
                        <button onClick={handleMatch} className="w-full py-12 bg-yellow-600 text-black font-black rounded-full text-5xl uppercase shadow-2xl">{loading ? "..." : t.match}</button>
                    </div>
                )}

                {view === 'results' && (
                    <div className="absolute inset-0 flex flex-col items-center px-10 pt-4">
                        <h2 className="text-6xl font-bold gold-text mb-12 tracking-wide" dir={lang === 'AR' ? "rtl" : "ltr"}>{t.resultsTitle}</h2>
                        <div className="w-[90%] h-[58vh] border border-yellow-600/20 rounded-[2.5rem] bg-black/40 overflow-y-auto p-6">
                            <table className="w-full border-collapse" dir={lang === 'AR' ? "rtl" : "ltr"}>
                                <tbody>
                                    {results.length > 0 ? results.map((res, i) => (
                                        <tr key={i} className="border-b border-yellow-600/10 h-28">
                                            <td className="text-5xl font-bold text-gray-200 pr-8">{res.name}</td>
                                            <td className="text-5xl text-yellow-500 font-black pl-8">{res.score}%</td>
                                        </tr>
                                    )) : <tr><td className="text-center py-20 text-yellow-600/40 text-4xl italic">Finding matches...</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setView('onboarding')} className="mt-12 py-10 px-16 border-b-4 border-yellow-600 text-4xl font-black text-yellow-600 uppercase">{t.retry}</button>
                    </div>
                )}

                <div className="absolute bottom-20 w-full px-12 text-center pointer-events-none">
                    <p className="text-4xl md:text-5xl spiritual-quote italic mb-6 leading-tight font-medium" dir={lang === 'AR' ? "rtl" : "ltr"}>{t.quotes[0].text}</p>
                    <p className="text-2xl text-yellow-600/40">— {t.quotes[0].author}</p>
                </div>
            </main>
        </div>
    );
}
