import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

// ─── 首頁專用音效 ─────────────────────
let homeAudioCtx = null;
function getCtx() {
    if (!homeAudioCtx || homeAudioCtx.state === 'closed')
        homeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (homeAudioCtx.state === 'suspended') homeAudioCtx.resume();
    return homeAudioCtx;
}

function playWelcome() {
    const ctx = getCtx(); const now = ctx.currentTime;
    // 歡樂開場：C5→E5→G5→C6 上行琶音 + 鈴鐺泛音
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = 'sine';
        const g = ctx.createGain(); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.18, now + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.5);
        o.frequency.setValueAtTime(f, now + i * 0.12);
        o.connect(g); o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.5);
        // 泛音
        const s = ctx.createOscillator(); s.type = 'sine';
        const sg = ctx.createGain(); sg.connect(ctx.destination);
        sg.gain.setValueAtTime(0.06, now + i * 0.12 + 0.05);
        sg.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
        s.frequency.setValueAtTime(f * 2, now + i * 0.12 + 0.05);
        s.connect(sg); s.start(now + i * 0.12 + 0.05); s.stop(now + i * 0.12 + 0.4);
    });
}

function playHoverPop() {
    const ctx = getCtx(); const now = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    const g = ctx.createGain(); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.1, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    o.frequency.setValueAtTime(1200, now);
    o.frequency.exponentialRampToValueAtTime(800, now + 0.06);
    o.connect(g); o.start(now); o.stop(now + 0.1);
}

function playSelectChime() {
    const ctx = getCtx(); const now = ctx.currentTime;
    // 魔法選擇音：三連叮 + 滑音
    [784, 988, 1319, 1568].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = i < 3 ? 'sine' : 'triangle';
        const g = ctx.createGain(); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.2 - i * 0.03, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        o.frequency.setValueAtTime(f, now + i * 0.1);
        o.connect(g); o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3);
    });
}

function playBackClick() {
    const ctx = getCtx(); const now = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'triangle';
    const g = ctx.createGain(); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    o.frequency.setValueAtTime(600, now);
    o.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    o.connect(g); o.start(now); o.stop(now + 0.15);
}

// ─── 浮動元素 ─────────────────────
const DECO = ['🍃', '🌿', '🍂', '🌸', '✨', '🦋', '🌻', '⭐'];

// ─── 元件 ─────────────────────
export default function HomePage() {
    const navigate = useNavigate();
    const [showGrades, setShowGrades] = useState(false);
    const grades = Object.entries(DEFAULT_QUESTIONS);
    const welcomePlayed = useRef(false);

    const handleCardClick = useCallback((type) => {
        playSelectChime();
        if (type === 'writing') {
            setTimeout(() => navigate('/writing'), 300);
        } else {
            setTimeout(() => setShowGrades(true), 200);
        }
    }, [navigate]);

    const handleGradeClick = useCallback((gradeNum) => {
        playSelectChime();
        setTimeout(() => navigate(`/game/${gradeNum}`), 250);
    }, [navigate]);

    // 第一次觸摸時播放歡迎音效
    const onFirstTouch = useCallback(() => {
        if (!welcomePlayed.current) {
            welcomePlayed.current = true;
            playWelcome();
        }
    }, []);

    return (
        <div className="home-container" onTouchStart={onFirstTouch} onClick={onFirstTouch}>
            {/* 浮動裝飾 */}
            {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="floating-leaf" style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: `${5 + Math.random() * 90}%`,
                    fontSize: `${1 + Math.random() * 1.5}rem`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${4 + Math.random() * 4}s`,
                }}>
                    {DECO[i % DECO.length]}
                </span>
            ))}

            <AnimatePresence mode="wait">
                {!showGrades ? (
                    /* ===== 主選擇畫面 ===== */
                    <motion.div
                        key="main-select"
                        className="landing-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* 標題 */}
                        <div className="landing-header">
                            <motion.div
                                className="landing-mascot"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            >
                                <svg viewBox="0 0 200 200" style={{ width: '90px', height: '90px' }}>
                                    <circle cx="58" cy="80" r="22" fill="#A0522D" />
                                    <circle cx="142" cy="80" r="22" fill="#A0522D" />
                                    <circle cx="100" cy="130" r="65" fill="#A0522D" />
                                    <circle cx="100" cy="145" r="38" fill="#DEB887" opacity="0.4" />
                                    <circle cx="78" cy="120" r="7" fill="#1e293b" />
                                    <circle cx="122" cy="120" r="7" fill="#1e293b" />
                                    <circle cx="80" cy="117" r="2.5" fill="white" />
                                    <circle cx="124" cy="117" r="2.5" fill="white" />
                                    <path d="M 83 150 Q 100 168 117 150" stroke="#1e293b" strokeWidth="4" fill="#FECACA" strokeLinecap="round" />
                                    <ellipse cx="100" cy="138" rx="8" ry="6" fill="#4a3728" />
                                    <circle cx="65" cy="140" r="10" fill="#FECACA" opacity="0.5" />
                                    <circle cx="135" cy="140" r="10" fill="#FECACA" opacity="0.5" />
                                </svg>
                            </motion.div>
                            <h1 className="landing-title">🌲 魔法學習森林</h1>
                            <p className="landing-subtitle">嗨！我是小熊，你想學什麼呢？</p>
                        </div>

                        {/* 雙卡片 */}
                        <div className="landing-cards">
                            <motion.button
                                className="landing-card landing-card-writing"
                                onClick={() => handleCardClick('writing')}
                                onHoverStart={playHoverPop}
                                whileHover={{ scale: 1.04, y: -6 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <div className="lcard-glow lcard-glow-writing" />
                                <div className="lcard-icon">📖</div>
                                <div className="lcard-title">國語寫字</div>
                                <div className="lcard-desc">練習寫出漂亮的國字<br />自訂字練習 · 連續測試</div>
                                <div className="lcard-badge">✏️ 開始練習</div>
                            </motion.button>

                            <motion.button
                                className="landing-card landing-card-math"
                                onClick={() => handleCardClick('math')}
                                onHoverStart={playHoverPop}
                                whileHover={{ scale: 1.04, y: -6 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <div className="lcard-glow lcard-glow-math" />
                                <div className="lcard-icon">🧮</div>
                                <div className="lcard-title">數學森林</div>
                                <div className="lcard-desc">加減乘除大冒險<br />年級 1~6 · 小動物陪你玩</div>
                                <div className="lcard-badge">🌲 開始冒險</div>
                            </motion.button>
                        </div>

                        <Link to="/admin/login" className="admin-link">🔧 管理後台</Link>
                    </motion.div>
                ) : (
                    /* ===== 數學年級選擇 ===== */
                    <motion.div
                        key="grade-select"
                        className="landing-view"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="grade-back-row">
                            <button className="topbar-back" onClick={() => { playBackClick(); setShowGrades(false); }}>←</button>
                            <h2 className="grade-select-title">🌲 選擇年級</h2>
                        </div>

                        <div className="grade-grid">
                            {grades.map(([gradeNum, data], i) => (
                                <motion.button
                                    key={gradeNum}
                                    className="grade-card"
                                    onClick={() => handleGradeClick(gradeNum)}
                                    onHoverStart={playHoverPop}
                                    style={{ '--card-accent': data.color }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                                    whileHover={{ y: -6, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="grade-emoji">{data.emoji}</span>
                                    <div className="grade-label">{data.name}</div>
                                    <div className="grade-desc">{data.desc}</div>
                                </motion.button>
                            ))}
                        </div>

                        {/* 小熊 */}
                        <motion.div
                            style={{ textAlign: 'center', padding: '16px 0 30px' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <svg viewBox="0 0 200 200" style={{ width: '70px', height: '70px', margin: '0 auto' }}>
                                <circle cx="58" cy="80" r="22" fill="#A0522D" />
                                <circle cx="142" cy="80" r="22" fill="#A0522D" />
                                <circle cx="100" cy="130" r="65" fill="#A0522D" />
                                <circle cx="100" cy="145" r="38" fill="#DEB887" opacity="0.4" />
                                <circle cx="78" cy="120" r="7" fill="#1e293b" />
                                <circle cx="122" cy="120" r="7" fill="#1e293b" />
                                <circle cx="80" cy="117" r="2.5" fill="white" />
                                <circle cx="124" cy="117" r="2.5" fill="white" />
                                <path d="M 83 150 Q 100 168 117 150" stroke="#1e293b" strokeWidth="4" fill="#FECACA" strokeLinecap="round" />
                                <ellipse cx="100" cy="138" rx="8" ry="6" fill="#4a3728" />
                                <circle cx="65" cy="140" r="10" fill="#FECACA" opacity="0.5" />
                                <circle cx="135" cy="140" r="10" fill="#FECACA" opacity="0.5" />
                            </svg>
                            <p style={{ color: '#166534', fontWeight: 700, fontSize: '0.85rem', marginTop: '6px' }}>
                                選一個年級，我們出發吧！🚀
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
