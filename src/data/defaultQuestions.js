/**
 * 數學森林 — 預設題庫
 * 涵蓋小學 1~6 年級的數學運算
 * 
 * 每個年級包含多種題型配置：
 * - type: 題型標識 (addition, subtraction, multiplication, division, mixed)
 * - label: 題型顯示名稱
 * - ops: 可用運算符
 * - minVal / maxVal: 數值範圍
 * - levels: 難度等級 (每等級可有不同範圍)
 * - encouragement: 鼓勵語句
 */

const GRADE_EMOJIS = ['🌱', '🌿', '🌳', '🏔️', '⭐', '👑'];
const GRADE_NAMES = ['一年級', '二年級', '三年級', '四年級', '五年級', '六年級'];
const GRADE_COLORS = ['#4ade80', '#38bdf8', '#f472b6', '#fb923c', '#a78bfa', '#22d3ee'];
const GRADE_DESCS = [
    '10以內加減法',
    '100以內加減、認識乘法',
    '萬以內四則運算',
    '大數計算、多位數乘除',
    '分數與小數運算',
    '分數四則、比率百分比'
];

const ENCOURAGEMENTS = {
    correct: [
        "太棒了！🎉",
        "你真聰明！✨",
        "答對了！繼續加油！💪",
        "好厲害！👏",
        "正確！你是數學小天才！🌟",
        "完美！🎯",
        "太強了！🔥",
        "讚啦！👍",
        "沒問題！💯",
        "你好棒！🏆"
    ],
    wrong: [
        "再想想看喔！🤔",
        "沒關係，再試一次！💪",
        "差一點點！加油！",
        "不要放棄喔！🌈",
        "想一想，你可以的！✨"
    ],
    combo: [
        "連勝中！超厲害！🔥🔥",
        "停不下來！太強了！⚡",
        "無人能擋！💫",
        "驚人的連勝！🌟🌟",
        "數學之王！👑"
    ],
    levelUp: [
        "升級了！越來越厲害！🎉",
        "恭喜升級！繼續挑戰！🚀",
        "等級提升！你真了不起！✨",
        "又升一級！加油！🎊"
    ]
};

const UNLOCKABLE_ITEMS = [
    { id: 'bow', name: '蝴蝶結', emoji: '🎀', starsNeeded: 5 },
    { id: 'hat', name: '派對帽', emoji: '🎉', starsNeeded: 10 },
    { id: 'glasses', name: '眼鏡', emoji: '👓', starsNeeded: 20 },
    { id: 'crown', name: '皇冠', emoji: '👑', starsNeeded: 35 },
    { id: 'cape', name: '披風', emoji: '🦸', starsNeeded: 50 },
    { id: 'wand', name: '魔法棒', emoji: '🪄', starsNeeded: 75 },
    { id: 'wings', name: '翅膀', emoji: '🦋', starsNeeded: 100 },
    { id: 'star', name: '星星光環', emoji: '💫', starsNeeded: 150 },
];

/**
 * 題型配置
 * 每個年級有多個 level (子等級)，學生在同一年級內也能感受到進步
 */
const DEFAULT_QUESTIONS = {
    1: {
        name: '一年級',
        emoji: '🌱',
        color: '#4ade80',
        desc: '10以內加減法',
        levels: [
            { level: 1, label: '10以內加法', ops: ['+'], min: 1, max: 10, msg: '我們從最簡單的開始！' },
            { level: 2, label: '20以內加法', ops: ['+'], min: 1, max: 20, msg: '數字變大一點囉！' },
            { level: 3, label: '20以內減法', ops: ['-'], min: 1, max: 20, msg: '來學減法吧！' },
            { level: 4, label: '20以內加減混合', ops: ['+', '-'], min: 1, max: 20, msg: '加減法混在一起囉！' },
            { level: 5, label: '30以內加減', ops: ['+', '-'], min: 1, max: 30, msg: '挑戰更大的數字！' },
            { level: 6, label: '50以內加減', ops: ['+', '-'], min: 1, max: 50, msg: '數字越來越大了！' },
            { level: 7, label: '100以內加減', ops: ['+', '-'], min: 1, max: 100, msg: '你已經是一年級的高手了！' },
        ]
    },
    2: {
        name: '二年級',
        emoji: '🌿',
        color: '#38bdf8',
        desc: '100以內加減、認識乘法',
        levels: [
            { level: 1, label: '100以內加減', ops: ['+', '-'], min: 1, max: 100, msg: '二年級的挑戰開始！' },
            { level: 2, label: '九九乘法 (1-5)', ops: ['×'], min: 1, max: 5, msg: '乘法登場！' },
            { level: 3, label: '九九乘法 (1-9)', ops: ['×'], min: 1, max: 9, msg: '九九乘法全部來！' },
            { level: 4, label: '加減乘混合', ops: ['+', '-', '×'], min: 1, max: 20, msg: '加減乘混在一起囉！' },
            { level: 5, label: '200以內加減', ops: ['+', '-'], min: 10, max: 200, msg: '挑戰更大的數字！' },
            { level: 6, label: '兩位數乘一位數', ops: ['×'], min: 2, max: 20, msg: '更大的乘法！' },
            { level: 7, label: '200以內加減乘混合', ops: ['+', '-', '×'], min: 1, max: 100, msg: '你是二年級達人！' },
        ]
    },
    3: {
        name: '三年級',
        emoji: '🌳',
        color: '#f472b6',
        desc: '千以內四則運算',
        levels: [
            { level: 1, label: '100以內加減', ops: ['+', '-'], min: 10, max: 100, msg: '三年級暖身！' },
            { level: 2, label: '九九乘法複習', ops: ['×'], min: 1, max: 9, msg: '複習乘法表！' },
            { level: 3, label: '兩位數乘一位數', ops: ['×'], min: 2, max: 30, msg: '更大的乘法！' },
            { level: 4, label: '基礎除法', ops: ['÷'], min: 2, max: 9, msg: '除法來了！' },
            { level: 5, label: '500以內加減', ops: ['+', '-'], min: 50, max: 500, msg: '大數字加減！' },
            { level: 6, label: '乘除混合', ops: ['×', '÷'], min: 2, max: 12, msg: '乘除混合練習！' },
            { level: 7, label: '1000以內四則', ops: ['+', '-', '×', '÷'], min: 1, max: 200, msg: '四則運算大挑戰！' },
        ]
    },
    4: {
        name: '四年級',
        emoji: '🏔️',
        color: '#fb923c',
        desc: '大數計算、多位數乘除',
        levels: [
            { level: 1, label: '1000以內加減', ops: ['+', '-'], min: 100, max: 1000, msg: '四年級開始！' },
            { level: 2, label: '兩位數乘兩位數', ops: ['×'], min: 10, max: 50, msg: '兩位數相乘！' },
            { level: 3, label: '三位數除以一位數', ops: ['÷'], min: 2, max: 9, msg: '大數的除法！' },
            { level: 4, label: '5000以內加減', ops: ['+', '-'], min: 500, max: 5000, msg: '數字更大了！' },
            { level: 5, label: '多位數乘法', ops: ['×'], min: 10, max: 99, msg: '乘法大師！' },
            { level: 6, label: '有餘數的除法', ops: ['÷'], min: 2, max: 12, msg: '來算有餘數的除法！' },
            { level: 7, label: '四則運算挑戰', ops: ['+', '-', '×', '÷'], min: 1, max: 500, msg: '你是四年級的王者！' },
        ]
    },
    5: {
        name: '五年級',
        emoji: '⭐',
        color: '#a78bfa',
        desc: '分數與小數運算',
        levels: [
            { level: 1, label: '小數加法', ops: ['+'], min: 1, max: 20, decimal: true, msg: '小數登場！' },
            { level: 2, label: '小數減法', ops: ['-'], min: 1, max: 20, decimal: true, msg: '小數減法！' },
            { level: 3, label: '小數乘法', ops: ['×'], min: 1, max: 10, decimal: true, msg: '小數乘法！' },
            { level: 4, label: '分數加法 (同分母)', ops: ['+'], min: 1, max: 10, fraction: true, msg: '分數來了！' },
            { level: 5, label: '分數減法 (同分母)', ops: ['-'], min: 1, max: 10, fraction: true, msg: '分數減法！' },
            { level: 6, label: '小數四則混合', ops: ['+', '-', '×'], min: 1, max: 15, decimal: true, msg: '小數混合運算！' },
            { level: 7, label: '分數與小數', ops: ['+', '-'], min: 1, max: 10, fraction: true, msg: '五年級全能挑戰！' },
        ]
    },
    6: {
        name: '六年級',
        emoji: '👑',
        color: '#22d3ee',
        desc: '分數四則、比率百分比',
        levels: [
            { level: 1, label: '分數乘法', ops: ['×'], min: 1, max: 10, fraction: true, msg: '六年級開始！' },
            { level: 2, label: '分數除法', ops: ['÷'], min: 1, max: 10, fraction: true, msg: '分數除法！' },
            { level: 3, label: '分數四則混合', ops: ['+', '-', '×', '÷'], min: 1, max: 8, fraction: true, msg: '分數大混戰！' },
            { level: 4, label: '百分比計算', ops: ['%'], min: 10, max: 100, percent: true, msg: '百分比來了！' },
            { level: 5, label: '比率與比值', ops: [':'], min: 2, max: 20, ratio: true, msg: '比率挑戰！' },
            { level: 6, label: '大數四則運算', ops: ['+', '-', '×', '÷'], min: 100, max: 9999, msg: '大數計算！' },
            { level: 7, label: '綜合大挑戰', ops: ['+', '-', '×', '÷'], min: 1, max: 1000, msg: '你是數學王者！👑' },
        ]
    }
};

export {
    DEFAULT_QUESTIONS,
    GRADE_EMOJIS,
    GRADE_NAMES,
    GRADE_COLORS,
    GRADE_DESCS,
    ENCOURAGEMENTS,
    UNLOCKABLE_ITEMS,
};
