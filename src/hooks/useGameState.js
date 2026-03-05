import { useState, useCallback, useRef } from 'react';
import { DEFAULT_QUESTIONS, ENCOURAGEMENTS } from '../data/defaultQuestions';

/**
 * 出題引擎 — 根據年級與等級配置動態生成題目
 */
function generateQuestion(grade, level, levelConfigs) {
    const gradeData = levelConfigs?.[grade] || DEFAULT_QUESTIONS[grade];
    if (!gradeData) return null;

    const levels = gradeData.levels || [];
    const config = levels.find(l => l.level === level) || levels[levels.length - 1] || levels[0];
    if (!config) return null;

    const ops = config.ops || ['+'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const min = config.min || 1;
    const max = config.max || 10;

    let n1, n2, correct, display;

    // 分數題
    if (config.fraction) {
        return generateFractionQuestion(op, min, max, config);
    }

    // 小數題
    if (config.decimal) {
        return generateDecimalQuestion(op, min, max, config);
    }

    // 百分比
    if (config.percent) {
        return generatePercentQuestion(min, max, config);
    }

    // 比率
    if (config.ratio) {
        return generateRatioQuestion(min, max, config);
    }

    // 整數題
    switch (op) {
        case '+': {
            n1 = randInt(min, max - 1);
            n2 = randInt(min, Math.min(max - n1, max));
            correct = n1 + n2;
            break;
        }
        case '-': {
            correct = randInt(Math.max(0, min - 5), max - min);
            n2 = randInt(min, Math.max(min, max - correct));
            n1 = n2 + correct;
            if (n1 > max * 1.5) {
                n1 = randInt(min + 1, max);
                n2 = randInt(min, n1);
                correct = n1 - n2;
            }
            break;
        }
        case '×': {
            if (max <= 9) {
                n1 = randInt(Math.max(1, min), 9);
                n2 = randInt(Math.max(1, min), 9);
            } else if (max <= 50) {
                n1 = randInt(2, Math.min(max, 20));
                n2 = randInt(2, 9);
            } else {
                n1 = randInt(10, Math.min(max, 99));
                n2 = randInt(2, Math.min(30, Math.floor(max / n1) || 9));
            }
            correct = n1 * n2;
            break;
        }
        case '÷': {
            n2 = randInt(Math.max(2, min), Math.min(12, max));
            const quotient = randInt(2, Math.min(Math.floor(max / n2), 50));
            n1 = n2 * quotient;
            correct = quotient;
            break;
        }
        default: {
            n1 = randInt(min, max);
            n2 = randInt(min, max);
            correct = n1 + n2;
        }
    }

    const options = generateOptions(correct, 3);
    return {
        n1, n2, op, correct, options,
        display: `${n1} ${op} ${n2}`,
        msg: config.msg,
        levelLabel: config.label,
    };
}

function generateFractionQuestion(op, min, max, config) {
    const denominators = [2, 3, 4, 5, 6, 8, 10];
    const denom = denominators[Math.floor(Math.random() * denominators.length)];

    let n1, n2, correct, display;

    switch (op) {
        case '+': {
            n1 = randInt(1, denom - 1);
            n2 = randInt(1, denom - n1);
            correct = n1 + n2;
            display = `${n1}/${denom} + ${n2}/${denom}`;
            // 答案也是分數：correct/denom
            const options = generateFractionOptions(correct, denom, 3);
            return { n1: `${n1}/${denom}`, n2: `${n2}/${denom}`, op, correct: `${correct}/${denom}`, options, display, msg: config.msg, levelLabel: config.label, isFraction: true };
        }
        case '-': {
            n1 = randInt(2, denom - 1);
            n2 = randInt(1, n1 - 1);
            correct = n1 - n2;
            display = `${n1}/${denom} - ${n2}/${denom}`;
            const options = generateFractionOptions(correct, denom, 3);
            return { n1: `${n1}/${denom}`, n2: `${n2}/${denom}`, op, correct: `${correct}/${denom}`, options, display, msg: config.msg, levelLabel: config.label, isFraction: true };
        }
        case '×': {
            const num = randInt(1, 5);
            const whole = randInt(2, 6);
            correct = num * whole;
            display = `${num}/${denom} × ${whole}`;
            const options = generateFractionOptions(correct, denom, 3);
            return { n1: `${num}/${denom}`, n2: whole, op, correct: `${correct}/${denom}`, options, display, msg: config.msg, levelLabel: config.label, isFraction: true };
        }
        case '÷': {
            const num = randInt(2, 8);
            const divisor = randInt(2, 4);
            correct = num;
            display = `${num * divisor}/${denom} ÷ ${divisor}`;
            const options = generateFractionOptions(correct, denom, 3);
            return { n1: `${num * divisor}/${denom}`, n2: divisor, op, correct: `${correct}/${denom}`, options, display, msg: config.msg, levelLabel: config.label, isFraction: true };
        }
        default: {
            n1 = randInt(1, denom - 1);
            n2 = randInt(1, denom - n1);
            correct = n1 + n2;
            display = `${n1}/${denom} + ${n2}/${denom}`;
            const options = generateFractionOptions(correct, denom, 3);
            return { n1: `${n1}/${denom}`, n2: `${n2}/${denom}`, op: '+', correct: `${correct}/${denom}`, options, display, msg: config.msg, levelLabel: config.label, isFraction: true };
        }
    }
}

function generateDecimalQuestion(op, min, max, config) {
    let n1 = (randInt(min * 10, max * 10) / 10);
    let n2 = (randInt(min * 10, max * 10) / 10);
    let correct;

    switch (op) {
        case '+':
            correct = Math.round((n1 + n2) * 10) / 10;
            break;
        case '-':
            if (n2 > n1) [n1, n2] = [n2, n1];
            correct = Math.round((n1 - n2) * 10) / 10;
            break;
        case '×':
            n1 = Math.round(n1);
            n2 = (randInt(1, 9) / 10);
            correct = Math.round((n1 * n2) * 10) / 10;
            break;
        default:
            correct = Math.round((n1 + n2) * 10) / 10;
    }

    const display = `${n1} ${op} ${n2}`;
    const options = generateDecimalOptions(correct, 3);
    return { n1, n2, op, correct, options, display, msg: config.msg, levelLabel: config.label, isDecimal: true };
}

function generatePercentQuestion(min, max, config) {
    const base = randInt(min, max);
    const percent = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
    const correct = (base * percent) / 100;
    const display = `${base} 的 ${percent}%`;
    const options = generateOptions(correct, 3);
    return { n1: base, n2: `${percent}%`, op: '×', correct, options, display, msg: config.msg, levelLabel: config.label, isPercent: true };
}

function generateRatioQuestion(min, max, config) {
    const a = randInt(min, max);
    const b = randInt(min, max);
    const gcd = getGCD(a, b);
    const correct = `${a / gcd}:${b / gcd}`;
    const display = `${a}:${b} 的最簡比`;

    // Generate wrong options
    const options = [correct];
    while (options.length < 3) {
        const fa = randInt(1, 10);
        const fb = randInt(1, 10);
        const fake = `${fa}:${fb}`;
        if (!options.includes(fake)) options.push(fake);
    }
    options.sort(() => Math.random() - 0.5);

    return { n1: a, n2: b, op: ':', correct, options, display, msg: config.msg, levelLabel: config.label, isRatio: true };
}

function getGCD(a, b) {
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min > max) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correct, count) {
    const opts = [correct];
    let attempts = 0;
    while (opts.length < count && attempts < 50) {
        const diff = randInt(-5, 5);
        const fake = correct + (diff === 0 ? (Math.random() > 0.5 ? 1 : -1) : diff);
        if (fake > 0 && !opts.includes(fake)) opts.push(fake);
        attempts++;
    }
    // Fallback
    while (opts.length < count) {
        opts.push(correct + opts.length);
    }
    opts.sort(() => Math.random() - 0.5);
    return opts;
}

function generateFractionOptions(correctNum, denom, count) {
    const correctStr = `${correctNum}/${denom}`;
    const opts = [correctStr];
    let attempts = 0;
    while (opts.length < count && attempts < 50) {
        const diff = randInt(-3, 3);
        const fakeNum = correctNum + (diff === 0 ? 1 : diff);
        if (fakeNum > 0 && fakeNum <= denom * 2) {
            const fakeStr = `${fakeNum}/${denom}`;
            if (!opts.includes(fakeStr)) opts.push(fakeStr);
        }
        attempts++;
    }
    while (opts.length < count) {
        opts.push(`${correctNum + opts.length}/${denom}`);
    }
    opts.sort(() => Math.random() - 0.5);
    return opts;
}

function generateDecimalOptions(correct, count) {
    const opts = [correct];
    let attempts = 0;
    while (opts.length < count && attempts < 50) {
        const diff = randInt(-5, 5) / 10;
        const fake = Math.round((correct + (diff === 0 ? 0.1 : diff)) * 10) / 10;
        if (fake > 0 && !opts.includes(fake)) opts.push(fake);
        attempts++;
    }
    while (opts.length < count) {
        opts.push(Math.round((correct + opts.length * 0.1) * 10) / 10);
    }
    opts.sort(() => Math.random() - 0.5);
    return opts;
}

/**
 * 遊戲狀態管理 Hook
 */
export default function useGameState(grade) {
    const [stars, setStars] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState({ text: '', type: 'normal' });
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showCombo, setShowCombo] = useState(false);
    const [comboText, setComboText] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [answerState, setAnswerState] = useState(null); // 'correct' | 'wrong' | null
    const [selectedOption, setSelectedOption] = useState(null);
    const [unlockedItems, setUnlockedItems] = useState([]);
    const [particles, setParticles] = useState([]);
    const [levelConfigs, setLevelConfigs] = useState(null);

    const isProcessing = useRef(false);
    const questionIdCounter = useRef(0);
    const recentQuestions = useRef([]);

    const nextQuestion = useCallback(() => {
        let q = null;
        let attempts = 0;
        const maxAttempts = 10;

        // 嘗試生成不與近期重複的題目
        while (attempts < maxAttempts) {
            q = generateQuestion(grade, currentLevel, levelConfigs);
            if (!q) break;

            const isDuplicate = recentQuestions.current.includes(q.display);
            if (!isDuplicate || attempts >= maxAttempts - 1) break;
            attempts++;
        }

        if (q) {
            // 為題目加上唯一 ID
            questionIdCounter.current += 1;
            q.id = `q-${Date.now()}-${questionIdCounter.current}`;

            // 更新近期題目記錄（保留最近 5 題）
            recentQuestions.current = [
                ...recentQuestions.current.slice(-4),
                q.display,
            ];
        }

        setQuestion(q);
        setAnswerState(null);
        setSelectedOption(null);
        isProcessing.current = false;
    }, [grade, currentLevel, levelConfigs]);

    const handleAnswer = useCallback((val) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setSelectedOption(val);
        setTotalQuestions(prev => prev + 1);

        const isCorrect = String(val) === String(question?.correct);

        if (isCorrect) {
            const newStars = stars + 1;
            const newStreak = streak + 1;
            const newTotal = totalCorrect + 1;

            setStars(newStars);
            setStreak(newStreak);
            setTotalCorrect(newTotal);
            setAnswerState('correct');
            if (newStreak > bestStreak) setBestStreak(newStreak);

            // 鼓勵語
            const msgs = ENCOURAGEMENTS.correct;
            setFeedback({ text: msgs[Math.floor(Math.random() * msgs.length)], type: 'happy' });

            // Combo 特效
            if (newStreak >= 3) {
                const comboMsgs = ENCOURAGEMENTS.combo;
                setComboText(`${newStreak} 連勝！`);
                setShowCombo(true);
                setFeedback({ text: comboMsgs[Math.floor(Math.random() * comboMsgs.length)], type: 'excited' });
                setTimeout(() => setShowCombo(false), 1200);
            }

            // 粒子特效
            spawnParticles();

            // 升級檢查 (每5顆星升一級)
            if (newStars > 0 && newStars % 5 === 0) {
                const gradeData = levelConfigs?.[grade] || DEFAULT_QUESTIONS[grade];
                const maxLevel = gradeData?.levels?.length || 7;

                if (currentLevel < maxLevel) {
                    setTimeout(() => {
                        setCurrentLevel(prev => prev + 1);
                        setShowLevelUp(true);
                    }, 600);
                } else if (newStars >= 35) {
                    // 該年級全部通關
                    setTimeout(() => setShowResult(true), 800);
                    return;
                }
            }

            setTimeout(nextQuestion, 1200);
        } else {
            setStreak(0);
            setAnswerState('wrong');
            const msgs = ENCOURAGEMENTS.wrong;
            setFeedback({ text: msgs[Math.floor(Math.random() * msgs.length)], type: 'sad' });

            setTimeout(() => {
                setAnswerState(null);
                setSelectedOption(null);
                isProcessing.current = false;
            }, 1000);
        }
    }, [question, stars, streak, bestStreak, totalCorrect, currentLevel, grade, levelConfigs, nextQuestion]);

    const spawnParticles = useCallback(() => {
        const colors = ['#4ade80', '#fbbf24', '#f472b6', '#38bdf8', '#a78bfa', '#fb923c'];
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: Date.now() + i,
            x: 40 + Math.random() * 20,
            y: 30 + Math.random() * 20,
            size: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 0.3,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 2000);
    }, []);

    const dismissLevelUp = useCallback(() => {
        setShowLevelUp(false);
    }, []);

    const xpProgress = ((stars % 5) / 5) * 100;

    const gradeData = levelConfigs?.[grade] || DEFAULT_QUESTIONS[grade];
    const currentLevelData = gradeData?.levels?.find(l => l.level === currentLevel) || gradeData?.levels?.[0];

    return {
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
        unlockedItems,
        particles,
        xpProgress,
        currentLevelData,
        gradeData,
        handleAnswer,
        nextQuestion,
        dismissLevelUp,
        setShowResult,
        setLevelConfigs,
    };
}
