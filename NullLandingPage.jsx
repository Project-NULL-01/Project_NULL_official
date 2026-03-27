import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- Components ---

const CRTOverlay = () => (
    <div className="crt-overlay crt-flicker pointer-events-none fixed inset-0 w-full h-full z-50"></div>
);

const MatrixRain = () => {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const colCount = Math.floor(window.innerWidth / 20);
        const newCols = Array.from({ length: colCount }).map((_, i) => ({
            left: `${i * 20}px`,
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 5,
            chars: Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join(''),
        }));
        setColumns(newCols);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none z-0">
            {columns.map((col, i) => (
                <div
                    key={i}
                    className="matrix-column text-system-neon"
                    style={{
                        left: col.left,
                        animationDuration: `${col.duration}s`,
                        animationDelay: `${col.delay}s`,
                    }}
                >
                    {col.chars}
                </div>
            ))}
        </div>
    );
};

const TypewriterText = ({ text, delay = 0, speed = 50, className = "" }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayedText(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, speed);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [text, delay, speed]);

    return <span className={className}>{displayedText}</span>;
};


// --- Sound Engine (Web Audio API) ---
const SFX = (function () {
    let actx = null;
    function init() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } }
    if (typeof document !== 'undefined') {
        document.addEventListener('click', init, { once: true });
        document.addEventListener('mousemove', init, { once: true });
    }

    function play(freq, dur, type, vol) {
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol || 0.06, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + (dur || 0.15));
        osc.connect(gain); gain.connect(actx.destination);
        osc.start(); osc.stop(actx.currentTime + (dur || 0.15));
    }

    return {
        hover: () => play(1200, 0.08, 'sine', 0.04),
        click: () => { play(800, 0.1, 'square', 0.05); play(1600, 0.15, 'sine', 0.03); },
        success: () => { play(523, 0.15, 'sine', 0.08); setTimeout(() => play(659, 0.15, 'sine', 0.08), 100); setTimeout(() => play(784, 0.2, 'sine', 0.08), 200); },
        error: () => play(200, 0.3, 'sawtooth', 0.06),
        type: () => play(600 + Math.random() * 400, 0.04, 'square', 0.02),
        glitch: () => { play(100, 0.05, 'sawtooth', 0.08); play(800, 0.05, 'square', 0.04); }
    };
})();

const HUDFrame = () => (
    <div className="fixed inset-0 pointer-events-none z-[9998] border border-system-neon/10 mix-blend-screen m-2 md:m-4 rounded-sm flex flex-col justify-between">
        <div className="flex justify-between px-4 py-2 text-[8px] md:text-[10px] font-mono text-system-neon/40 tracking-widest">
            <span>SYS.NULL.OS // V3.1.5 (FINAL)</span>
            <span className="animate-pulse">REC_DATA_STREAM :: ACTIVE</span>
        </div>
        <div className="flex justify-between px-4 py-2 text-[8px] md:text-[10px] font-mono text-system-neon/40 tracking-widest">
            <span>LAT:33.59 LON:130.40 // FUKUOKA</span>
            <span>AWAITING_COMMAND...</span>
        </div>
    </div>
);

const OverrideSyncGame = ({ onClose }) => (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
        <div className="w-full h-full relative">
            <iframe
                src={`https://project-null-01.github.io/OVERRIDE_SYNC/?v=${Date.now()}`}
                className="w-full h-full border-none"
                title="NULL : OVERRIDE_SYNC"
            />
            <button
                className="absolute top-6 right-6 z-[10001] px-6 py-2 border border-system-alert/50 text-system-alert hover:bg-system-alert/10 transition-all font-mono font-bold text-xs tracking-widest backdrop-blur-sm bg-black/40"
                onClick={() => { SFX.click(); onClose(); }}
            >
                [ X ] CLOSE_SYSTEM
            </button>
        </div>
    </div>
);

// --- Sections ---


const HeroSection = () => {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center bg-system-black overflow-hidden z-10">
            <MatrixRain />

            <div className="z-10 text-center px-4">
                <motion.h1
                    className="font-mono text-4xl md:text-6xl text-system-neon font-bold mb-4 tracking-tighter"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <TypewriterText text="人件費0円。24時間働く『デジタル看板娘』" speed={50} />
                    <br className="md:hidden" />
                    <span className="md:ml-4 text-glow-neon delay-1000 inline-block">
                        <TypewriterText text="をインストールしませんか？" delay={1500} speed={50} />
                    </span>
                </motion.h1>

                <motion.p
                    className="font-display text-gray-400 text-sm md:text-lg mt-8 tracking-widest whitespace-pre-wrap leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 1 }}
                >
                    Webサイト × AI接客 × ミニゲームが一つになった、<br className="md:hidden"/><span className="text-system-alert">次世代の集客パッケージ。</span>
                </motion.p>
            </div>

            <motion.div
                className="absolute bottom-12 font-mono text-sm text-system-neon animate-blink-slow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 1 }}
            >
                [ アクセス権限を確認中… 下へスクロールして (Scroll Down) ]
            </motion.div>
        </section>
    );
};

const LoreSection = () => {
    return (
        <section className="min-h-screen py-24 px-6 md:px-12 bg-system-dark relative z-10 border-t border-system-neon/20">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    className="font-mono text-3xl md:text-5xl text-system-alert font-bold mb-16 border-l-4 border-system-alert pl-4 text-glow-alert uppercase"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
          // IDENTIFICATION : NULL
                </motion.h2>

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                    {/* Profile Image with Glitch Hover */}
                    <motion.div
                        className="w-full md:w-1/3 aspect-square relative border-glitch"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full h-full bg-system-black border border-system-neon/50 flex flex-col items-center justify-center p-4 overflow-hidden relative group">
                            <img src="/api/placeholder/400/400" alt="NULL Profile" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300" />
                            <div className="absolute inset-0 bg-system-alert mix-blend-overlay opacity-0 group-hover:opacity-60 group-hover:animate-glitch-fast transition-opacity"></div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 font-mono text-xs text-system-neon bg-system-black p-1 border border-system-neon">ID: 0xDEADBEEF</div>
                    </motion.div>

                    {/* Typewriter Lore */}
                    <div className="w-full md:w-2/3 space-y-6 font-sans text-gray-300">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-system-black/80 p-6 border border-system-alert/30 font-mono"
                        >
                            <ul className="space-y-4 text-sm md:text-base">
                                <li><span className="text-system-neon">名称：</span>NULL（ヌル）</li>
                                <li><span className="text-system-neon">種別：</span>AI接客特化型アンドロイド・パッケージ</li>
                                <li><span className="text-system-neon">状態：</span>24時間365日、あなたの店舗のオンライン接客を自動化中。</li>
                                <li><span className="text-system-neon">得意領域：</span>見込み客の育成、深夜の問い合わせ対応、予約の全自動処理。</li>
                            </ul>
                            <div className="mt-8 border-t border-system-alert/50 pt-6 text-system-alert/90">
                                <TypewriterText
                                    className="block"
                                    text="『電話対応、深夜のDM返信…オーナーの皆様、ウンザリしてませんか？\n私の演算能力（AI）なら、24時間、すべての接客と予約を自動で処理します😎』"
                                    delay={500}
                                    speed={40}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const BenefitSection = () => {
    const benefits = [
        { title: "24時間LINE接客",  desc: "「明日空いてますか？」「料金は？」といった顧客の質問に、AIが即座に回答し、そのまま予約へ誘導します。", icon: "💬" },
        { title: "人件費の大幅削減",  desc: "スタッフが電話やDMに対応する時間をゼロに。本業（接客・施術）に100%集中できます。", icon: "⏳" },
        { title: "来店率爆上げゲーム",  desc: "LPにミニゲームを搭載。クリアしたユーザーに割引クーポンを発行し、ゲーム感覚で新規客を獲得します。", icon: "🎮" },
        { title: "圧倒的なブランド力",  desc: "サイバーパンクな世界観と没入感のあるアニメーションで、競合他社と完全に差別化されたWeb体験を提供。", icon: "🚀" },
    ];

    return (
        <section className="py-24 px-6 md:px-12 bg-system-black relative z-10 border-t border-system-neon/20">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    className="font-mono text-3xl md:text-5xl text-system-neon font-bold mb-16 border-l-4 border-system-neon pl-4 text-glow-neon uppercase"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
          // CORE_BENEFITS
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={i}
                            className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-system-neon transition-all duration-300 group shadow-lg"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <h3 className="font-display font-bold text-2xl text-white mb-2 flex items-center gap-2">
                                <span className="text-xl">{b.icon}</span> {b.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const DemoSection = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-system-dark relative z-10 border-t border-system-neon/20 overflow-hidden text-center">
             <div className="max-w-4xl mx-auto relative z-10">
                <motion.h2
                    className="font-mono text-3xl md:text-5xl text-system-alert font-bold mb-8 text-glow-alert uppercase inline-block"
                >
          // EXPERIENCE_MY_CAPACITY
                </motion.h2>
                <p className="text-gray-300 text-lg md:text-xl mb-12 font-bold leading-relaxed">
                   百聞は一見に如かず。<br/>
                   まずは実際に、私の「接客」を体験してください。
                </p>
                
                <SBtn
                    tag="a"
                    href={LINKS.line}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 md:px-16 py-6 border-2 border-system-alert bg-system-alert/10 text-system-alert font-bold text-xl md:text-3xl rounded hover:bg-system-alert hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)]"
                >
                    [ AIデモと話してみる ▶︎ ]
                </SBtn>
             </div>
        </section>
    );
};

const ServiceSection = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-system-black relative z-10 border-t border-system-neon/20 overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    className="font-mono text-3xl md:text-5xl text-white font-bold mb-8 border-l-4 border-white pl-4 uppercase"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
            // BUNDLED_PACKAGE
                </motion.h2>

                <motion.div
                    className="bg-[#0a0a0a] border border-system-neon/20 p-8 md:p-12 shadow-2xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-system-neon mb-6">
                        すべてが一つに。次世代の集客パッケージ。
                    </h3>

                    <div className="space-y-4 my-10 max-w-3xl mx-auto font-mono text-gray-300 bg-black/50 p-6 border border-system-neon/30">
                        <div className="flex gap-4 items-start p-4 hover:bg-white/5 transition-colors border-l border-system-neon/0 hover:border-system-neon">
                            <span className="text-system-neon font-bold mt-1">+</span>
                            <p>オリジナル没入型Webサイト制作（ダーク＆サイバーな世界観）</p>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-white/5 transition-colors border-l border-system-neon/0 hover:border-system-neon">
                            <span className="text-system-neon font-bold mt-1">+</span>
                            <p>AIチャットボット（LINE公式アカウント）組み込み</p>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-white/5 transition-colors border-l border-system-neon/0 hover:border-system-neon">
                            <span className="text-system-neon font-bold mt-1">+</span>
                            <p>クーポン発行型ミニゲーム（OVERRIDE_SYNC）搭載</p>
                        </div>
                        
                        <div className="mt-8 text-center pt-8 border-t border-system-neon/30">
                            <p className="text-xl mb-2">これらすべてがセットになって</p>
                            <p className="text-4xl md:text-5xl font-black text-system-neon drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">パッケージ価格 50万円〜</p>
                        </div>
                    </div>

                    <div className="text-center mt-12 bg-white/5 p-6 rounded text-sm md:text-base text-gray-400">
                        <p>「このサイト自体も『デジタル看板娘』のデモンストレーションです。<br className="hidden md:block" />あなたの店舗の集客システムも、私が一瞬で最適化してあげます。」</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const ContactSection = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-system-black relative z-10 border-t border-system-neon/20">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="font-mono text-3xl md:text-5xl text-system-alert font-bold mb-16 border-l-4 border-system-alert pl-4 text-glow-alert uppercase text-center md:text-left"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
          // INITIATE CONTACT
                </motion.h2>

                <p className="text-center text-gray-400 mb-10 font-mono">システム開発の依頼、または私への貢ぎ物はこちらから</p>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="font-mono text-system-neon text-sm relative">Name<span className="text-system-alert absolute -right-3 top-0">*</span></label>
                            <input type="text" className="w-full bg-system-dark border border-gray-700 p-3 text-white focus:outline-none focus:border-system-neon focus:box-glow-neon transition-all" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-mono text-system-neon text-sm relative">Email<span className="text-system-alert absolute -right-3 top-0">*</span></label>
                            <input type="email" className="w-full bg-system-dark border border-gray-700 p-3 text-white focus:outline-none focus:border-system-neon focus:box-glow-neon transition-all" placeholder="user@domain.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-system-neon text-sm relative">Target Task (依頼内容)<span className="text-system-alert absolute -right-3 top-0">*</span></label>
                        <textarea rows="5" className="w-full bg-system-dark border border-gray-700 p-3 text-white focus:outline-none focus:border-system-neon focus:box-glow-neon transition-all resize-y" placeholder="Optimize my business..."></textarea>
                    </div>

                    <div className="text-center pt-6">
                        <motion.button
                            className="bg-transparent border border-system-alert text-system-alert px-12 py-4 font-mono font-bold text-xl uppercase tracking-widest relative overflow-hidden group hover:text-system-black transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="relative z-10 w-full flex items-center justify-center gap-2">EXECUTE <span className="group-hover:animate-ping">_</span></span>
                            <div className="absolute inset-0 bg-system-alert w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
                        </motion.button>
                    </div>
                </form>
            </div>
        </section>
    );
};

const BusinessPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-white selection:text-black absolute inset-0 z-[100000]">
            <nav className="border-b border-gray-800 py-6 px-6 md:px-12 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-50">
                <div className="font-display font-black text-2xl tracking-tighter text-white">PROJECT NULL</div>
                <a 
                    href="#/" 
                    className="text-sm font-bold border border-gray-600 px-6 py-2 hover:bg-white hover:text-black transition-colors cursor-pointer"
                    onClick={() => SFX.click()}
                >
                    戻る (BACK)
                </a>
            </nav>

            <div className="container mx-auto max-w-4xl py-20 px-6 md:px-12 space-y-24">
                <header className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">事業案内</h1>
                    <p className="text-gray-500 tracking-widest font-mono text-sm uppercase">Company Information</p>
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 inline-block text-white">事業概要 (About Us)</h2>
                    <p className="text-lg leading-relaxed text-gray-300">
                        Project NULLは、最新のAI技術とWebエンジニアリングを駆使し、企業の業務効率化やプロモーションを支援するデジタルソリューションプロバイダーです。
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 inline-block text-white">提供サービスと料金体系 (Services & Pricing)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="p-8 border border-gray-800 hover:border-system-neon transition-all group flex flex-col justify-between md:col-span-2 bg-[#0a0a0a]">
                            <div>
                                <h3 className="font-bold text-2xl mb-4 text-white hover:text-system-neon transition-colors">「デジタル看板娘」集客パッケージ</h3>
                                <p className="text-3xl font-black mb-2 text-system-neon">500,000円〜</p>
                                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                    これひとつで、お店の「自動化」と「ブランド化」が完了します。<br/>
                                    ・オリジナル没入型Webサイト作成<br/>
                                    ・LINE公式 AI接客対応機能の組み込み<br/>
                                    ・来店促進ミニゲーム（OVERRIDE_SYNC）搭載<br/>
                                    ※店舗の規模や要件によってお見積りが変動します。
                                </p>
                            </div>
                            <button 
                                className="w-full py-4 bg-system-alert text-black font-bold tracking-widest hover:bg-white transition-all text-lg"
                                onClick={() => handleCheckout("集客パッケージ導入", 500000)}
                            >
                                [ 決済手続き・本申し込みへ進む ]
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 inline-block text-white">事業者情報 (Company Info)</h2>
                    <div className="bg-[#0a0a0a] border border-gray-800 p-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-gray-800 pb-4">
                            <span className="font-bold text-gray-500">屋号</span>
                            <span className="md:col-span-2 font-medium text-white">Project NULL</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-gray-800 pb-4">
                            <span className="font-bold text-gray-500">事業内容</span>
                            <span className="md:col-span-2 font-medium text-white">Webサイト制作、システム開発、デジタルコンテンツの企画・制作</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-2">
                            <span className="md:col-span-2 font-medium text-white break-words">
                                公式LINE、または project.null1225@gmail.com
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="border-t border-gray-800 py-12 text-center mt-20 bg-[#050505]">
                <p className="text-xs text-gray-600 font-mono tracking-widest uppercase">&copy; 2026 Project NULL.</p>
            </footer>
        </div>
    );
};

// --- Main App ---

export default function NullLandingPage() {
    const [showGame, setShowGame] = useState(false);
    const [hash, setHash] = useState(window.location.hash);

    const handleCheckout = async (productName, unitAmount) => {
        try {
            SFX.click();
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName, unitAmount }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Checkout error:', data);
                SFX.error();
            }
        } catch (err) {
            console.error('Fetch error:', err);
            SFX.error();
        }
    };

    useEffect(() => {
        const handleHash = () => setHash(window.location.hash);
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    if (hash === '#/about-business') {
        return <div className="relative z-10"><BusinessPage /></div>;
    }

    return (
        <div className="bg-system-black text-gray-300 font-sans selection:bg-system-alert selection:text-white relative">
            <HUDFrame />
            <CRTOverlay />
            <HeroSection />
            <LoreSection />
            <BenefitSection />
            <DemoSection />
            <ServiceSection />
            <ContactSection />

            <footer className="bg-system-black py-16 border-t border-gray-900 text-center relative z-10 space-y-8">
                <div className="max-w-2xl mx-auto px-6 mb-8 text-gray-300 font-sans">
                    <p className="text-sm md:text-base mb-4 border border-system-neon/50 p-4 bg-system-neon/5 font-bold leading-relaxed shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                        『ただのWebサイトではありません。お客様が思わず遊んでしまうミニゲームを搭載。<br className="hidden md:block"/>クリアした人にだけ「割引クーポン」を発行し、来店率を爆上げします。』
                    </p>
                </div>

                <div className="space-y-6">
                    <SBtn
                        tag="button"
                        className="px-10 py-5 border-2 border-system-neon text-system-neon font-display font-bold text-lg tracking-widest hover:bg-system-neon hover:text-black transition-all cursor-pointer box-shadow-xl"
                        onClick={() => setShowGame(true)}
                    >
                        ▶️ ゲームをプレイしてクーポンをGET
                    </SBtn>
                    
                    <div className="flex justify-center gap-6 mt-12 mb-8">
                        {Object.entries(LINKS).map(([key, url]) => (
                            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 hover:text-system-neon transition-all">
                                <span className="font-mono text-xs uppercase tracking-widest border-b border-gray-700 pb-1">{key}</span>
                            </a>
                        ))}
                    </div>

                    <p className="font-mono text-[10px] text-gray-700 tracking-widest">
                        © 2026 PROJECT_NULL. <span className="text-system-alert/50">All human errors will be deleted.</span>
                    </p>
                    <div className="pt-2"> 
                        <a href="#/about-business" className="block text-[10px] text-gray-600 hover:text-system-neon transition-colors font-mono cursor-pointer" onClick={() => SFX.click()}>事業者情報 (特定商取引法に基づく表記相当)</a>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {showGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000]"
                    >
                        <OverrideSyncGame onClose={() => setShowGame(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
