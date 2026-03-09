import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_WORD_POOL = ["學", "校", "春", "天", "花", "開", "小", "朋", "友", "老", "師", "聽", "說", "讀", "寫", "家", "書", "包", "愛", "星", "月"];
const COLOR_OPTIONS = [
    { hex: "#000000", name: "魔法黑" },
    { hex: "#ef4444", name: "紅蘋果" },
    { hex: "#3b82f6", name: "藍精靈" },
    { hex: "#22c55e", name: "綠草地" },
    { hex: "#eab308", name: "黃太陽" },
    { hex: "rainbow", name: "彩虹筆" }
];
const TITLES = ["魔法學徒", "文字小法師", "魔導小書生", "文字守護者", "書寫大賢者"];

export default function WritingPage() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const zoneRef = useRef(null);
    const compRef = useRef(null);
    const compCtxRef = useRef(null);
    const effectRef = useRef(null);
    const drawingRef = useRef(false);

    const [wordPool, setWordPool] = useState([...DEFAULT_WORD_POOL]);
    const [wordIdx, setWordIdx] = useState(0);
    const [brushColor, setBrushColor] = useState("#000000");
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [stars, setStars] = useState(0);
    const [status, setStatus] = useState('writing'); // writing, modal
    const [isTestMode, setIsTestMode] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [modal, setModal] = useState(null); // { type, lvlUp }
    const [customText, setCustomText] = useState('');

    const currentWord = wordPool[wordIdx] || '學';

    // 初始化 canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const zone = zoneRef.current;
        const comp = compRef.current;
        if (!canvas || !zone || !comp) return;

        compCtxRef.current = comp.getContext('2d');

        const resize = () => {
            const wrapper = zone.parentElement;
            if (!wrapper) return;
            const ww = wrapper.clientWidth - 16;
            const wh = wrapper.clientHeight - 16;
            const size = Math.min(ww, wh);
            zone.style.width = size + 'px';
            zone.style.height = size + 'px';
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = size + 'px';
            canvas.style.height = size + 'px';
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = size * 0.055;
            ctxRef.current = ctx;
            // 引導字大小 = 容器的 85%
            const guideEl = zone.querySelector('.writing-char-guide');
            if (guideEl) guideEl.style.fontSize = Math.round(size * 0.85) + 'px';
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    // 載入新字時唸出來
    useEffect(() => {
        speakWord(currentWord);
    }, [wordIdx, wordPool]);

    const speakWord = (word) => {
        const msg = new SpeechSynthesisUtterance(word);
        msg.lang = 'zh-TW';
        msg.rate = 0.8;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    };

    const clearCanvas = () => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    };

    const createSparkle = (x, y) => {
        const el = effectRef.current;
        if (!el) return;
        const s = document.createElement('div');
        s.className = 'writing-sparkle';
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        s.style.setProperty('--tx', (Math.random() - 0.5) * 140 + 'px');
        s.style.setProperty('--ty', (Math.random() - 0.5) * 140 + 'px');
        s.innerText = ['✨', '⭐', '🎈', '🍭'][Math.floor(Math.random() * 4)];
        el.appendChild(s);
        setTimeout(() => s.remove(), 800);
    };

    // Canvas 互動
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const start = (e) => {
            if (status !== 'writing') return;
            drawingRef.current = true;
            const ctx = ctxRef.current;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            createSparkle(pos.x, pos.y);
        };
        const move = (e) => {
            if (!drawingRef.current) return;
            e.preventDefault();
            const ctx = ctxRef.current;
            const pos = getPos(e);
            ctx.strokeStyle = brushColor === 'rainbow' ? `hsl(${(Date.now() / 4) % 360}, 80%, 55%)` : brushColor;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            if (Math.random() > 0.88) createSparkle(pos.x, pos.y);
        };
        const stop = () => { drawingRef.current = false; };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', stop);
        return () => {
            canvas.removeEventListener('mousedown', start);
            canvas.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            canvas.removeEventListener('touchstart', start);
            canvas.removeEventListener('touchmove', move);
            canvas.removeEventListener('touchend', stop);
        };
    }, [brushColor, status]);

    // 偵測寫字
    const checkWriting = () => {
        const canvas = canvasRef.current;
        const compCtx = compCtxRef.current;
        if (!canvas || !compCtx) return false;

        const size = 64;
        compCtx.clearRect(0, 0, size, size);
        compCtx.drawImage(canvas, 0, 0, size, size);
        const userData = compCtx.getImageData(0, 0, size, size).data;

        compCtx.clearRect(0, 0, size, size);
        compCtx.fillStyle = 'black';
        compCtx.font = `bold ${size * 0.8}px "Noto Sans TC"`;
        compCtx.textAlign = 'center';
        compCtx.textBaseline = 'middle';
        compCtx.fillText(currentWord, size / 2, size / 2);
        const guideData = compCtx.getImageData(0, 0, size, size).data;

        let hit = 0, noise = 0, guideTotal = 0, userTotal = 0;
        for (let i = 3; i < userData.length; i += 4) {
            const u = userData[i] > 20, g = guideData[i] > 20;
            if (g) guideTotal++;
            if (u) userTotal++;
            if (u && g) hit++;
            else if (u && !g) noise++;
        }
        const accuracy = hit / guideTotal;
        const noiseRatio = noise / guideTotal;
        return (accuracy >= 0.20 && noiseRatio < 1.5 && userTotal > 50);
    };

    const handleCheck = () => {
        const passed = checkWriting();
        if (passed) {
            const newStars = stars + 1;
            let newXp = xp + 34;
            let newLevel = level;
            let lvlUp = false;
            if (newXp >= 100) { newXp = 0; newLevel++; lvlUp = true; }
            setStars(newStars);
            setXp(newXp);
            setLevel(newLevel);
            if (isTestMode) {
                setTestResults(prev => [...prev, { char: currentWord, passed: true }]);
            }
            setStatus('modal');
            setModal({ type: 'success', lvlUp, isLast: isTestMode && wordIdx >= wordPool.length - 1 });
        } else {
            if (isTestMode) {
                setTestResults(prev => [...prev, { char: currentWord, passed: false }]);
            }
            setStatus('modal');
            setModal({ type: 'fail', lvlUp: false, isLast: isTestMode && wordIdx >= wordPool.length - 1 });
        }
    };

    const handleModalNext = () => {
        setModal(null);
        setStatus('writing');
        if (modal?.isLast) {
            setShowReport(true);
        } else {
            setWordIdx(prev => (prev + 1) % wordPool.length);
            clearCanvas();
        }
    };

    const handleModalRetry = () => {
        setModal(null);
        setStatus('writing');
        if (isTestMode && modal?.isLast) {
            setShowReport(true);
        }
    };

    const parseChars = (str) => {
        return str.replace(/[,，、\s]+/g, ' ').trim().split(' ').filter(c => c.length === 1 && /[\u4e00-\u9fff]/.test(c));
    };

    const startCustomTest = () => {
        const chars = parseChars(customText);
        if (chars.length === 0) return;
        setShowCustomInput(false);
        setWordPool(chars);
        setWordIdx(0);
        setIsTestMode(true);
        setTestResults([]);
        clearCanvas();
    };

    const closeReport = () => {
        setShowReport(false);
        setIsTestMode(false);
        setTestResults([]);
        setWordPool([...DEFAULT_WORD_POOL]);
        setWordIdx(0);
        clearCanvas();
    };

    const parsedPreview = parseChars(customText);

    return (
        <div className="writing-container">
            {/* 頂部 */}
            <div className="writing-topbar">
                <div className="writing-topbar-row">
                    <button className="topbar-back" onClick={() => navigate('/')}>←</button>
                    <div className="writing-level-info">
                        <div className="writing-level-circle">{level}</div>
                        <div>
                            <div style={{ fontSize: '0.55rem', color: '#92400e', fontWeight: 800 }}>LEVEL</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#78350f' }}>{TITLES[Math.min(level - 1, TITLES.length - 1)]}</div>
                        </div>
                    </div>
                    <button className="writing-speak-btn" onClick={() => speakWord(currentWord)}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2563eb' }}>{currentWord}</span>
                        <span style={{ fontSize: '1.2rem' }}>🔊</span>
                    </button>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.55rem', color: '#9ca3af', fontWeight: 800 }}>STARS</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#eab308' }}>⭐ {stars}</div>
                    </div>
                </div>
                <div className="writing-topbar-row" style={{ gap: '8px' }}>
                    <button className="writing-custom-btn" onClick={() => setShowCustomInput(true)}>✏️ 自訂國字</button>
                    <div className="writing-xp-bar">
                        <div className="writing-xp-fill" style={{ width: `${xp}%` }} />
                    </div>
                </div>
                {isTestMode && (
                    <div className="writing-topbar-row" style={{ gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#7c3aed' }}>📝 測驗模式</span>
                        <div className="writing-progress-dots">
                            {wordPool.map((_, i) => (
                                <div
                                    key={i}
                                    className="writing-dot"
                                    style={{
                                        background: i < wordIdx ? (testResults[i]?.passed ? '#22c55e' : '#ef4444') : i === wordIdx ? '#a855f7' : '#e2e8f0',
                                        transform: i === wordIdx ? 'scale(1.4)' : 'scale(1)',
                                        boxShadow: i === wordIdx ? '0 0 6px rgba(168,85,247,0.5)' : 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#7c3aed' }}>{wordIdx + 1}/{wordPool.length}</span>
                    </div>
                )}
            </div>

            {/* 寫字區 */}
            <div className="writing-area-wrapper" ref={el => { if (el) el._wrapper = true; }}>
                <div className="writing-square" ref={zoneRef}>
                    <div className="writing-grid-bg">
                        <div className="writing-grid-border" />
                        <div className="writing-grid-lines" />
                    </div>
                    {level < 3 && (
                        <div className="writing-char-guide">{currentWord}</div>
                    )}
                    <canvas ref={canvasRef} style={{ position: 'relative', zIndex: 10, display: 'block', cursor: 'crosshair' }} />
                    <div ref={effectRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }} />
                </div>
            </div>

            {/* 底部操作 */}
            <div className="writing-bottom">
                <div className="writing-color-row">
                    {COLOR_OPTIONS.map(c => (
                        <button
                            key={c.hex}
                            className={`writing-color-btn ${brushColor === c.hex ? 'active' : ''}`}
                            style={{
                                background: c.hex === 'rainbow' ? 'linear-gradient(to right, red, orange, yellow, green, blue, purple)' : c.hex,
                            }}
                            onClick={() => setBrushColor(c.hex)}
                        />
                    ))}
                </div>
                <div className="writing-btn-row">
                    <button className="writing-clear-btn" onClick={clearCanvas}>擦乾淨</button>
                    <button className="writing-check-btn" onClick={handleCheck}>
                        {isTestMode ? `檢查 ✨ (${wordIdx + 1}/${wordPool.length})` : '檢查魔法 ✨'}
                    </button>
                </div>
            </div>

            {/* 結果彈窗 */}
            <AnimatePresence>
                {modal && (
                    <motion.div className="writing-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                            className="writing-modal-box"
                            initial={{ scale: 0.7, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.7, y: 30 }}
                            style={{ borderColor: modal.type === 'success' ? '#4ade80' : '#f87171' }}
                        >
                            <div style={{ fontSize: '4rem' }}>{modal.type === 'success' ? (modal.lvlUp ? '🏆' : '✨') : '🦒'}</div>
                            <h2 className="writing-modal-title">
                                {modal.type === 'success' ? (modal.lvlUp ? '等級提升！' : '魔法成功！') : '再試一下下'}
                            </h2>
                            <p className="writing-modal-desc">
                                {modal.type === 'success' ? (
                                    modal.lvlUp ? (
                                        level >= 3
                                            ? `太強了！LV.${level} ${TITLES[Math.min(level - 1, TITLES.length - 1)]}！\n接下來沒有提示字囉，只靠耳朵聽寫！👂`
                                            : `太強了！你現在是 LV.${level} 的${TITLES[Math.min(level - 1, TITLES.length - 1)]}！`
                                    ) : '字寫得好漂亮，獲得了經驗值！'
                                ) : isTestMode ? '沒關係，我們繼續！' : '字好像還沒寫完，或是跑太遠了！請再練習一次！'}
                            </p>
                            {modal.type === 'success' || isTestMode ? (
                                <button className="writing-modal-btn" onClick={handleModalNext}>
                                    {modal.isLast ? '看成績單 📊' : `下一個字 ➡️`}
                                </button>
                            ) : (
                                <button className="writing-modal-btn" onClick={handleModalRetry}>我會寫更棒！💪</button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 自訂國字輸入 */}
            <AnimatePresence>
                {showCustomInput && (
                    <motion.div className="writing-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="writing-custom-modal" initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#7c3aed', textAlign: 'center' }}>✏️ 自訂練習國字</h3>
                            <p style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', margin: '4px 0 12px' }}>輸入想練習的國字，用空格或逗號分開</p>
                            <input
                                type="text"
                                value={customText}
                                onChange={e => setCustomText(e.target.value)}
                                placeholder="例如：花 草 木 林 森"
                                className="writing-custom-input"
                                autoComplete="off"
                            />
                            {parsedPreview.length > 0 && (
                                <div style={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center', margin: '6px 0' }}>
                                    共 {parsedPreview.length} 個字：{parsedPreview.join(' ')}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <button className="writing-custom-cancel" onClick={() => setShowCustomInput(false)}>取消</button>
                                <button className="writing-custom-start" onClick={startCustomTest}>開始測驗 🚀</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 成績單 */}
            <AnimatePresence>
                {showReport && (
                    <motion.div className="writing-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="writing-report" initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }}>
                            <div style={{ fontSize: '3.5rem' }}>🏆</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#92400e' }}>測驗成績單</h2>
                            <div style={{ fontSize: '1.8rem', margin: '4px 0' }}>
                                {'⭐'.repeat(Math.min(testResults.filter(r => r.passed).length, 10))}
                            </div>
                            <div style={{ fontWeight: 900, color: '#92400e', fontSize: '1.1rem' }}>
                                {testResults.filter(r => r.passed).length} / {testResults.length} 個字寫得好棒！
                            </div>
                            <div style={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>
                                正確率 {Math.round(testResults.filter(r => r.passed).length / testResults.length * 100)}%
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '16px' }}>
                                {testResults.map((r, i) => (
                                    <span key={i} style={{
                                        padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 900,
                                        background: r.passed ? '#dcfce7' : '#fee2e2',
                                        color: r.passed ? '#166534' : '#dc2626'
                                    }}>
                                        {r.char} {r.passed ? '✓' : '✗'}
                                    </span>
                                ))}
                            </div>
                            <button className="writing-modal-btn" onClick={closeReport}>太棒了！🎉</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 隱藏偵測畫布 */}
            <canvas ref={compRef} width={64} height={64} style={{ display: 'none' }} />
        </div>
    );
}
