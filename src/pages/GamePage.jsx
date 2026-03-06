import React, { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGameState from '../hooks/useGameState';
import useAudio from '../hooks/useAudio';
import { AnimalStrip, LevelUpAnimals } from '../components/ForestAnimals';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

export default function GamePage() {
    const { grade } = useParams();
    const gradeNum = parseInt(grade);
    const navigate = useNavigate();
    const gradeData = DEFAULT_QUESTIONS[gradeNum];

    const {
        stars,
        currentLevel,
        streak,
        bestStreak,
        totalCorrect,
        totalQuestions,
        question,
        feedback,
        showLevelUp,
        showCombo,
        comboText,
        showResult,
        answerState,
        selectedOption,
        particles,
        xpProgress,
        currentLevelData,
        handleAnswer,
        nextQuestion,
        dismissLevelUp,
        setShowResult,
    } = useGameState(gradeNum);

    const {
        isMuted,
        toggleMute,
        startBGM,
        stopBGM,
        playCorrect,
        playWrong,
        playClick,
        playLevelUp,
        playCombo,
    } = useAudio();

    const bgmStarted = useRef(false);

    // 初始化：載入第一題
    useEffect(() => {
        nextQuestion();
    }, []);

    // 離開頁面時停止背景音樂
    useEffect(() => {
        return () => stopBGM();
    }, [stopBGM]);

    // 答題音效
    useEffect(() => {
        if (answerState === 'correct') playCorrect();
        else if (answerState === 'wrong') playWrong();
    }, [answerState, playCorrect, playWrong]);

    // 連擊音效
    useEffect(() => {
        if (showCombo) playCombo();
    }, [showCombo, playCombo]);

    // 升級音效
    useEffect(() => {
        if (showLevelUp) playLevelUp();
    }, [showLevelUp, playLevelUp]);

    // 包裝 handleAnswer：加入點擊音效 + 首次互動啟動 BGM
    const onAnswer = useCallback((val) => {
        playClick();
        if (!bgmStarted.current) {
            startBGM();
            bgmStarted.current = true;
        }
        handleAnswer(val);
    }, [playClick, startBGM, handleAnswer]);

    if (!gradeData) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>找不到這個年級 😕</h2>
                <button onClick={() => navigate('/')} className="level-up-btn" style={{ marginTop: '20px' }}>回首頁</button>
            </div>
        );
    }

    const bgClass = `game-bg-${gradeNum}`;

    return (
        <div className={`game-container ${bgClass}`}>
            {/* 頂部資訊欄 */}
            <div className="game-topbar">
                <button className="topbar-back" onClick={() => navigate('/')}>
                    ←
                </button>
                <button
                    className="topbar-mute"
                    onClick={toggleMute}
                    title={isMuted ? '開啟音效' : '靜音'}
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
                <div className="topbar-stats">
                    <div className="topbar-stars">
                        ⭐ <span>{stars}</span>
                    </div>
                    {streak >= 3 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}
                        >
                            🔥{streak}
                        </motion.span>
                    )}
                </div>
                <div className="topbar-level">
                    {gradeData.emoji} LV.{currentLevel}
                </div>
            </div>

            {/* 經驗值進度條 */}
            <div className="xp-bar-container">
                <div className="xp-bar-wrapper">
                    <motion.div
                        className="xp-bar-fill"
                        initial={false}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                </div>
                <div className="xp-label">
                    <span>{currentLevelData?.label || gradeData.name}</span>
                    <span>{stars % 5}/5 ⭐ 升級</span>
                </div>
            </div>

            {/* 題目卡片 */}
            {question && (
                <motion.div
                    className={`question-card ${answerState === 'correct' ? 'correct-flash' : answerState === 'wrong' ? 'wrong-flash' : ''}`}
                    key={question.id}
                    initial={{ y: 10, scale: 0.97 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                    {question.isFraction || question.isPercent || question.isRatio || question.isDecimal ? (
                        <div className="question-numbers">
                            <span className="question-num" style={{ fontSize: '2.5rem' }}>
                                {question.display}
                            </span>
                        </div>
                    ) : (
                        <div className="question-numbers">
                            <span className="question-num">{question.n1}</span>
                            <span className="question-op">{question.op}</span>
                            <span className="question-num">{question.n2}</span>
                        </div>
                    )}
                    <div className="question-equals">= ?</div>
                </motion.div>
            )}

            {/* 選項按鈕 */}
            {question && (
                <div className="options-grid">
                    {question.options.map((opt, i) => {
                        let btnClass = 'option-btn';
                        if (selectedOption !== null) {
                            if (String(opt) === String(question.correct)) {
                                btnClass += answerState === 'correct' ? ' correct' : '';
                            } else if (String(opt) === String(selectedOption) && answerState === 'wrong') {
                                btnClass += ' wrong';
                            }
                        }
                        return (
                            <motion.button
                                key={`${question.id}-${i}`}
                                className={btnClass}
                                onClick={() => onAnswer(opt)}
                                initial={{ y: 6 }}
                                animate={{ y: 0 }}
                                transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 30 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {opt}
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {/* 森林動物收集條 + 對話框 */}
            <div className="forest-area">
                <AnimatePresence>
                    {feedback.text && (
                        <motion.div
                            className="forest-speech"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            key={feedback.text}
                        >
                            <p>{feedback.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimalStrip level={currentLevel} grade={gradeNum} mood={feedback.type} />
            </div>

            {/* Combo 特效 */}
            <AnimatePresence>
                {showCombo && (
                    <motion.div
                        className="combo-display"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <div className="combo-text">
                            🔥 {comboText}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 升級動畫 */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        className="level-up-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={dismissLevelUp}
                    >
                        <motion.div
                            className="level-up-card"
                            onClick={e => e.stopPropagation()}
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.5, y: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <span className="level-up-emoji">🎉</span>
                            <h2 className="level-up-title">升級了！</h2>
                            <p className="level-up-desc">
                                你已經到達等級 {currentLevel}！
                            </p>
                            <LevelUpAnimals level={currentLevel} grade={gradeNum} />
                            <button className="level-up-btn" onClick={dismissLevelUp}>
                                繼續挑戰！ 🚀
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 結算畫面 */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        className="result-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="result-card">
                            <motion.div
                                className="result-stars"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                            >
                                🌟🏆🌟
                            </motion.div>
                            <motion.h1
                                className="result-title"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                太厲害了！
                            </motion.h1>
                            <motion.p
                                className="result-subtitle"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {gradeData.name}全部通關！
                            </motion.p>
                            <motion.div
                                className="result-stats"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="result-stat">
                                    <span className="result-stat-num">{stars}</span>
                                    <span className="result-stat-label">星星</span>
                                </div>
                                <div className="result-stat">
                                    <span className="result-stat-num">{bestStreak}</span>
                                    <span className="result-stat-label">最高連勝</span>
                                </div>
                                <div className="result-stat">
                                    <span className="result-stat-num">
                                        {totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}%
                                    </span>
                                    <span className="result-stat-label">正確率</span>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
                            >
                                <button className="result-btn secondary" onClick={() => navigate('/')}>
                                    回首頁
                                </button>
                                <button className="result-btn" onClick={() => window.location.reload()}>
                                    再玩一次
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 粒子特效 */}
            {particles.length > 0 && (
                <div className="particles-container">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="particle"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size,
                                background: p.color,
                                animationDelay: `${p.delay}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
