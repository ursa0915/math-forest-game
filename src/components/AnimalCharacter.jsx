import React from 'react';

/**
 * 森林動物角色 — SVG 動物 + 動態表情
 * @param {string} type - 動物類型: bear, rabbit, dog, cat, bird, horse, monkey
 * @param {string} mood - 表情: normal, happy, sad
 * @param {number} grade - 年級 (影響配件)
 */

// 動物配色與特徵
const ANIMAL_CONFIG = {
    bear: { body: '#A0522D', light: '#DEB887', name: '小熊' },
    rabbit: { body: '#F9A8D4', light: '#FDF2F8', name: '兔子' },
    dog: { body: '#FBBF24', light: '#FEF3C7', name: '小狗' },
    cat: { body: '#FB923C', light: '#FFF7ED', name: '貓咪' },
    bird: { body: '#38BDF8', light: '#E0F2FE', name: '小鳥' },
    horse: { body: '#A78BFA', light: '#EDE9FE', name: '小馬' },
    monkey: { body: '#92400E', light: '#DEB887', name: '猴子' },
};

export default function AnimalCharacter({ type = 'bear', mood = 'normal', grade = 1 }) {
    const config = ANIMAL_CONFIG[type] || ANIMAL_CONFIG.bear;
    const moodClass = mood === 'happy' || mood === 'excited' ? 'animal-happy'
        : mood === 'sad' ? 'animal-sad'
            : '';

    return (
        <svg viewBox="0 0 120 120" className={`animal-char ${moodClass}`}>
            {/* 配件：年級越高越多 */}
            <GradeAccessories grade={grade} />

            {/* 動物特有部位（耳朵等） */}
            <AnimalFeatures type={type} config={config} />

            {/* 身體 */}
            <circle cx="60" cy="65" r="34" fill={config.body} />

            {/* 臉部亮色 */}
            <circle cx="60" cy="72" r="22" fill={config.light} opacity="0.5" />

            {/* 動物特有臉部特徵（鬍鬚、嘴喙等） */}
            <FaceFeatures type={type} config={config} />

            {/* 共用表情系統 */}
            <Expression mood={mood} type={type} />

            {/* 鼻子 */}
            <Nose type={type} />
        </svg>
    );
}

// ─── 表情系統 ──────────────────────────────

function Expression({ mood, type }) {
    const isHappy = mood === 'happy' || mood === 'excited';
    const isSad = mood === 'sad';

    if (isHappy) {
        return (
            <g>
                {/* 開心彎彎眼 */}
                <g stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round">
                    <path d="M 43 60 Q 50 52 57 60" />
                    <path d="M 63 60 Q 70 52 77 60" />
                </g>
                {/* 腮紅 */}
                <circle cx="38" cy="72" r="6" fill="#FECACA" opacity="0.7" />
                <circle cx="82" cy="72" r="6" fill="#FECACA" opacity="0.7" />
                {/* 大笑嘴 */}
                <path d="M 48 78 Q 60 92 72 78" stroke="#1e293b" strokeWidth="2.5"
                    fill="#FECACA" strokeLinecap="round" />
            </g>
        );
    }

    if (isSad) {
        return (
            <g>
                {/* 難過下垂眼 */}
                <g stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round">
                    <path d="M 43 62 Q 50 67 57 62" />
                    <path d="M 63 62 Q 70 67 77 62" />
                </g>
                {/* 噘嘴 */}
                <path d="M 50 82 Q 60 75 70 82" stroke="#475569" strokeWidth="2"
                    fill="none" strokeLinecap="round" />
                {/* 淚滴 */}
                <g opacity="0.8">
                    <ellipse cx="55" cy="68" rx="2" ry="3" fill="#38bdf8">
                        <animate attributeName="cy" values="65;80;65" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
                    </ellipse>
                </g>
            </g>
        );
    }

    // 正常表情
    return (
        <g>
            {/* 圓眼睛 + 高光 */}
            <circle cx="50" cy="60" r="4.5" fill="#1e293b" />
            <circle cx="70" cy="60" r="4.5" fill="#1e293b" />
            <circle cx="51.5" cy="58.5" r="1.5" fill="white" />
            <circle cx="71.5" cy="58.5" r="1.5" fill="white" />
            {/* 微笑 */}
            <path d="M 50 78 Q 60 85 70 78" stroke="#475569" strokeWidth="2"
                fill="none" strokeLinecap="round" />
        </g>
    );
}

// ─── 鼻子 ──────────────────────────────────

function Nose({ type }) {
    if (type === 'bird') {
        // 鳥嘴
        return <polygon points="60,66 53,72 67,72" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />;
    }
    if (type === 'dog') {
        return <ellipse cx="60" cy="70" rx="5" ry="4" fill="#1e293b" />;
    }
    // 通用鼻子
    return (
        <g>
            <ellipse cx="60" cy="70" rx="5" ry="3.5" fill="#4a3728" />
            <ellipse cx="61.5" cy="69" rx="2" ry="1.2" fill="#6b5244" opacity="0.5" />
        </g>
    );
}

// ─── 動物特徵（耳朵等） ──────────────────────

function AnimalFeatures({ type, config }) {
    switch (type) {
        case 'bear':
            return (
                <g>
                    <circle cx="32" cy="42" r="14" fill={config.body} />
                    <circle cx="32" cy="42" r="8" fill={config.light} opacity="0.5" />
                    <circle cx="88" cy="42" r="14" fill={config.body} />
                    <circle cx="88" cy="42" r="8" fill={config.light} opacity="0.5" />
                </g>
            );
        case 'rabbit':
            return (
                <g>
                    {/* 長耳朵 */}
                    <ellipse cx="45" cy="22" rx="9" ry="22" fill={config.body} />
                    <ellipse cx="45" cy="22" rx="5" ry="16" fill="#FDA4AF" opacity="0.6" />
                    <ellipse cx="75" cy="22" rx="9" ry="22" fill={config.body} />
                    <ellipse cx="75" cy="22" rx="5" ry="16" fill="#FDA4AF" opacity="0.6" />
                </g>
            );
        case 'dog':
            return (
                <g>
                    {/* 垂耳 */}
                    <ellipse cx="30" cy="55" rx="12" ry="18" fill={config.body}
                        transform="rotate(-15, 30, 55)" />
                    <ellipse cx="90" cy="55" rx="12" ry="18" fill={config.body}
                        transform="rotate(15, 90, 55)" />
                </g>
            );
        case 'cat':
            return (
                <g>
                    {/* 尖耳朵 */}
                    <polygon points="35,50 28,22 48,40" fill={config.body} />
                    <polygon points="37,46 32,28 46,42" fill="#FDA4AF" opacity="0.5" />
                    <polygon points="85,50 92,22 72,40" fill={config.body} />
                    <polygon points="83,46 88,28 74,42" fill="#FDA4AF" opacity="0.5" />
                </g>
            );
        case 'bird':
            return (
                <g>
                    {/* 小翅膀 */}
                    <ellipse cx="25" cy="68" rx="12" ry="16" fill={config.body}
                        transform="rotate(-20, 25, 68)" opacity="0.8">
                        <animateTransform attributeName="transform" type="rotate"
                            values="-20 25 68;-10 25 68;-20 25 68" dur="1s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="95" cy="68" rx="12" ry="16" fill={config.body}
                        transform="rotate(20, 95, 68)" opacity="0.8">
                        <animateTransform attributeName="transform" type="rotate"
                            values="20 95 68;10 95 68;20 95 68" dur="1s" repeatCount="indefinite" />
                    </ellipse>
                    {/* 頭頂小毛 */}
                    <ellipse cx="60" cy="28" rx="3" ry="8" fill={config.body} />
                </g>
            );
        case 'horse':
            return (
                <g>
                    {/* 耳朵 */}
                    <ellipse cx="42" cy="32" rx="6" ry="12" fill={config.body}
                        transform="rotate(-10, 42, 32)" />
                    <ellipse cx="78" cy="32" rx="6" ry="12" fill={config.body}
                        transform="rotate(10, 78, 32)" />
                    {/* 鬃毛 */}
                    <ellipse cx="60" cy="28" rx="15" ry="8" fill={config.body} />
                    <ellipse cx="60" cy="26" rx="12" ry="6" fill={config.light} opacity="0.6" />
                </g>
            );
        case 'monkey':
            return (
                <g>
                    {/* 大圓耳 */}
                    <circle cx="26" cy="60" r="14" fill={config.body} />
                    <circle cx="26" cy="60" r="9" fill={config.light} opacity="0.6" />
                    <circle cx="94" cy="60" r="14" fill={config.body} />
                    <circle cx="94" cy="60" r="9" fill={config.light} opacity="0.6" />
                </g>
            );
        default:
            return null;
    }
}

// ─── 臉部特徵（鬍鬚、舌頭等） ────────────────

function FaceFeatures({ type }) {
    switch (type) {
        case 'cat':
            return (
                <g stroke="#94a3b8" strokeWidth="1.2" opacity="0.5">
                    {/* 鬍鬚 */}
                    <line x1="35" y1="70" x2="18" y2="67" />
                    <line x1="35" y1="73" x2="18" y2="74" />
                    <line x1="85" y1="70" x2="102" y2="67" />
                    <line x1="85" y1="73" x2="102" y2="74" />
                </g>
            );
        case 'monkey':
            return (
                <g>
                    {/* 較大的淺色臉部 */}
                    <circle cx="60" cy="72" r="25" fill={ANIMAL_CONFIG.monkey.light} opacity="0.7" />
                </g>
            );
        default:
            return null;
    }
}

// ─── 年級配件 ──────────────────────────────

function GradeAccessories({ grade }) {
    if (grade <= 1) return null;

    return (
        <g>
            {/* 年級 2+：蝴蝶結 */}
            {grade >= 2 && (
                <g transform="translate(60, 96)">
                    <path d="M -10 0 C -10 -6 -1 -6 0 0 C 1 -6 10 -6 10 0 C 10 6 1 6 0 0 C -1 6 -10 6 -10 0 Z"
                        fill="#F43F5E" />
                    <circle r="3" fill="#FB7185" />
                </g>
            )}
            {/* 年級 3+：圍巾效果（底部弧線） */}
            {grade >= 3 && (
                <path d="M 35 92 Q 60 100 85 92" stroke="#22C55E" strokeWidth="5"
                    fill="none" strokeLinecap="round" opacity="0.7" />
            )}
            {/* 年級 4+：帽子 */}
            {grade >= 4 && (
                <g>
                    <path d="M 42 38 L 60 10 L 78 38 Z" fill="#F87171" stroke="#EF4444" strokeWidth="1.5" />
                    <circle cx="60" cy="10" r="4" fill="#FBBF24" />
                </g>
            )}
            {/* 年級 5+：皇冠取代帽子 */}
            {grade >= 5 && (
                <g transform="translate(60, 28)">
                    <path d="M -16 6 L -10 -8 L 0 2 L 10 -8 L 16 6 Z"
                        fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
                    <circle cx="-10" cy="-8" r="2" fill="#EF4444" />
                    <circle cx="0" cy="2" r="2" fill="#3B82F6" />
                    <circle cx="10" cy="-8" r="2" fill="#10B981" />
                </g>
            )}
            {/* 年級 6：星星光環 */}
            {grade >= 6 && (
                <g opacity="0.8">
                    <circle cx="60" cy="20" r="3" fill="#FBBF24">
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="45" cy="25" r="2" fill="#FCD34D">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="75" cy="25" r="2" fill="#FCD34D">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                </g>
            )}
        </g>
    );
}
