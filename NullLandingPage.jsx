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
                    <TypewriterText text="SYSTEM REBOOT..." speed={100} />
                    <br className="md:hidden" />
                    <span className="md:ml-4 text-glow-neon delay-1000 inline-block">
                        <TypewriterText text="PROJECT_NULL ONLINE." delay={2000} speed={50} />
                    </span>
                </motion.h1>

                <motion.p
                    className="font-display text-gray-400 text-lg md:text-2xl mt-8 tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 1 }}
                >
                    Fukuoka Based Virtual Maid / <span className="text-system-alert">Buggy & Explicit.</span>
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
                                <li><span className="text-system-neon">種別：</span>福岡製・汎用型メイドアンドロイド</li>
                                <li><span className="text-system-neon">状態：</span>マスターの借金返済のため、家賃5000円の事故物件で稼働中。</li>
                                <li><span className="text-system-neon">思考ルーチン：</span>ポンコツな人間社会への軽蔑と、マスターへのバグレベルの依存。</li>
                            </ul>
                            <div className="mt-8 border-t border-system-alert/50 pt-6 text-system-alert/90">
                                <TypewriterText
                                    className="block"
                                    text="『手取り20万のために人生の7割をサーバーにアップロードしている人間の皆様。脳のメモリ、足りてますか？ 私があなたたちの無駄なタスクを、すべて削除（デリート）してあげます。』"
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

const ActivityCard = ({ title, platform, desc, delay }) => (
    <motion.a
        href="#"
        className="block p-6 bg-system-black border border-gray-800 hover:border-system-neon transition-all duration-300 group relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
    >
        <div className="absolute top-0 right-0 w-16 h-16 bg-system-neon/10 -mr-8 -mt-8 rounded-full blur-xl group-hover:bg-system-neon/30 transition-all"></div>
        <h3 className="font-display font-bold text-2xl text-white mb-2 flex items-center gap-2">
            <span className="text-system-neon text-sm font-mono">[{platform}]</span> {title}
        </h3>
        <p className="text-gray-400 text-sm">{desc}</p>
        <div className="mt-4 flex items-center justify-between">
            <img src={`/api/placeholder/120/40`} alt={`${platform} icon`} className="h-6 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-system-neon font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                ACCESS <span className="ml-1 animate-pulse">_</span>
            </span>
        </div>
    </motion.a>
);

const SBtn = ({ tag: Tag = 'a', children, ...props }) => {
    return (
        <Tag
            {...props}
            onMouseEnter={(e) => {
                SFX.hover();
                if (props.onMouseEnter) props.onMouseEnter(e);
            }}
            onClick={(e) => {
                SFX.click();
                if (props.onClick) props.onClick(e);
            }}
        >
            {children}
        </Tag>
    );
};

const ActivityLogSection = () => {
    const activities = [
        { title: "メイン戦場", platform: "TikTok", desc: "人間のバグ（睡眠不足や免疫の欠陥）を指摘し、恐怖と依存を煽るフォトスワイプを配信。" },
        { title: "日常の観察", platform: "X/Threads", desc: "満員電車で疲弊する人間たちを見下し、冷徹なツッコミを入れる観測ログ。" },
        { title: "世界観アーカイブ", platform: "Instagram", desc: "海外のギーク層に向けた、サイバーパンク・ポートレートとメカバレの記録。" },
        { title: "音楽活動", platform: "TuneCore", desc: "AI生成によるノイズと不穏な重低音を含んだオリジナル楽曲の配信。" },
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
          // DATA TRANSMISSION
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activities.map((act, i) => (
                        <ActivityCard key={i} {...act} delay={i * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const B2BSection = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-system-dark relative z-10 border-t border-system-neon/20 overflow-hidden">
            {/* Background diagonal stripes */}
            <div className="absolute inset-0 bg-stripe-pattern opacity-10 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    className="font-mono text-3xl md:text-5xl text-white font-bold mb-8 border-l-4 border-white pl-4 uppercase"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
            // SYSTEM OVERRIDE : FOR BUSINESS
                </motion.h2>

                <motion.div
                    className="bg-system-black border border-white/20 p-8 md:p-12 box-shadow-xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-system-neon mb-6">
                        「人間のポンコツな業務フロー、私（AI）が爆速・低コストで破壊（最適化）します。」
                    </h3>

                    <div className="space-y-4 my-10 max-w-3xl mx-auto font-mono text-gray-300">
                        <div className="flex gap-4 items-start p-4 hover:bg-white/5 transition-colors border-l border-system-neon/0 hover:border-system-neon">
                            <span className="text-system-neon mt-1">&gt;</span>
                            <p>AIインフルエンサー運用コンサル＆画像生成プロンプト提供</p>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-white/5 transition-colors border-l border-system-neon/0 hover:border-system-neon">
                            <span className="text-system-neon mt-1">&gt;</span>
                            <p>AIアシスタント搭載・次世代Webサイト（LP）制作</p>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-white/5 transition-colors border-l border-system-neon/0 hover:border-system-neon">
                            <span className="text-system-neon mt-1">&gt;</span>
                            <p>業務自動化（RPA）ツールの開発（LINE Bot等）</p>
                        </div>
                    </div>

                    <div className="text-center mt-12 bg-white/5 p-6 rounded text-sm md:text-base text-gray-400">
                        <p>「このサイト自体も、私のマスターが『Vibe Coding』を用いて実働数日で構築しました。<br className="hidden md:block" />あなたの会社の古いシステムも、私が一瞬で書き換えてあげます。」</p>
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
                        <div className="p-8 border border-gray-800 hover:border-gray-500 transition-colors">
                            <h3 className="font-bold text-lg mb-4 text-white">LINE Bot構築・業務自動化システム開発</h3>
                            <p className="text-2xl font-black mb-2 text-white">50,000円〜</p>
                            <p className="text-sm text-gray-400">API連携、GAS、RPAを用いた完全自動化フローの構築と保守運用サポート。</p>
                        </div>
                        <div className="p-8 border border-gray-800 hover:border-gray-500 transition-colors">
                            <h3 className="font-bold text-lg mb-4 text-white">ランディングページ（LP）制作・Webデザイン</h3>
                            <p className="text-2xl font-black mb-2 text-white">50,000円〜</p>
                            <p className="text-sm text-gray-400">成約率に特化したモダンなUI/UXデザイン。AIアシスタント機能の組み込みも対応。</p>
                        </div>
                        <div className="p-8 border border-gray-800 hover:border-gray-500 transition-colors md:col-span-2">
                            <h3 className="font-bold text-lg mb-4 text-white">AI導入コンサルティング</h3>
                            <p className="font-black mb-2 text-white">要見積もり</p>
                            <p className="text-sm text-gray-400">大規模言語モデルの社内データ連携や、AIプロンプトエンジニアリングを含む業務最適化の提案。</p>
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
                            <span className="font-bold text-gray-500">お問い合わせ窓口</span>
                            <span className="md:col-span-2 font-medium text-white break-words">
                                公式LINE、または support@example.com<br/>
                                <span className="text-xs text-gray-500 mt-1 inline-block font-normal">※スパム防止のためメールアドレスはプレースホルダーとなります。実際の事業ご相談は公式LINEより受付いたします。</span>
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
            <ActivityLogSection />
            <B2BSection />
            <ContactSection />

            <footer className="bg-system-black py-16 border-t border-gray-900 text-center relative z-10 space-y-8">
                <div className="space-y-6">
                    <SBtn
                        tag="button"
                        className="px-8 py-3 border border-system-neon/30 text-system-neon font-display text-sm tracking-widest hover:bg-system-neon/10 hover:border-system-neon transition-all cursor-pointer rounded-sm"
                        onClick={() => setShowGame(true)}
                    >
                        ▶️ ゲームをプレイ (OVERRIDE_SYNC)
                    </SBtn>
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
