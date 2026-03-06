import React from 'react';

/**
 * 森林動物角色（全身版）— SVG 動物 + 身體 + 手臂 + 動態表情 + 互動動畫
 * 
 * CSS class 控制互動：
 *   .animal-celebrate  → 舉手慶祝（答對）
 *   .animal-highfive   → 擊掌（相鄰動物手臂伸出）
 *   .animal-sad-anim   → 安慰搖晃（答錯）
 *   .animal-idle       → 待機微動
 */

const ANIMAL_CONFIG = {
    bear: { body: '#A0522D', light: '#DEB887', belly: '#D2B48C' },
    rabbit: { body: '#F9A8D4', light: '#FDF2F8', belly: '#FFF1F2' },
    dog: { body: '#FBBF24', light: '#FEF3C7', belly: '#FFFBEB' },
    cat: { body: '#FB923C', light: '#FFF7ED', belly: '#FFEDD5' },
    bird: { body: '#38BDF8', light: '#E0F2FE', belly: '#F0F9FF' },
    horse: { body: '#A78BFA', light: '#EDE9FE', belly: '#F5F3FF' },
    monkey: { body: '#92400E', light: '#DEB887', belly: '#F5DEB3' },
};

export default function AnimalCharacter({ type = 'bear', mood = 'normal', grade = 1 }) {
    const c = ANIMAL_CONFIG[type] || ANIMAL_CONFIG.bear;
    const isHappy = mood === 'happy' || mood === 'excited';
    const isSad = mood === 'sad';

    return (
        <svg viewBox="0 0 100 150" className="animal-char">
            {/* ── 年級配件 ── */}
            <GradeAccessories grade={grade} />

            {/* ── 動物耳朵/頭部特徵 ── */}
            <Ears type={type} c={c} />

            {/* ── 頭部 ── */}
            <circle cx="50" cy="45" r="25" fill={c.body} />
            <circle cx="50" cy="52" r="16" fill={c.light} opacity="0.45" />

            {/* ── 臉部特徵 ── */}
            <FaceDetail type={type} c={c} />

            {/* ── 表情 ── */}
            <Expression mood={mood} />
            <Nose type={type} />

            {/* ── 身體 ── */}
            <ellipse cx="50" cy="95" rx="22" ry="28" fill={c.body} />
            {/* 肚子 */}
            <ellipse cx="50" cy="98" rx="14" ry="18" fill={c.belly} opacity="0.6" />

            {/* ── 腳 ── */}
            <Legs type={type} c={c} isHappy={isHappy} />

            {/* ── 手臂（用 CSS class 控制動畫） ── */}
            <g className="animal-arm-left">
                <path d={type === 'bird'
                    ? "M 28 85 Q 15 75 10 85 Q 15 95 28 90"
                    : "M 28 85 Q 18 80 15 90 Q 18 100 28 95"}
                    fill={c.body} />
            </g>
            <g className="animal-arm-right">
                <path d={type === 'bird'
                    ? "M 72 85 Q 85 75 90 85 Q 85 95 72 90"
                    : "M 72 85 Q 82 80 85 90 Q 82 100 72 95"}
                    fill={c.body} />
            </g>

            {/* ── 尾巴 ── */}
            <Tail type={type} c={c} />

            {/* ── 答對特效：星星 ── */}
            {isHappy && (
                <g className="celebrate-stars">
                    <text x="10" y="25" fontSize="10" opacity="0.8">⭐</text>
                    <text x="80" y="20" fontSize="8" opacity="0.6">✨</text>
                    <text x="5" y="60" fontSize="7" opacity="0.5">🌟</text>
                </g>
            )}

            {/* ── 答錯特效：汗滴 ── */}
            {isSad && (
                <g>
                    <ellipse cx="72" cy="38" rx="2" ry="3.5" fill="#93C5FD" opacity="0.7">
                        <animate attributeName="cy" values="36;48;36" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite" />
                    </ellipse>
                </g>
            )}
        </svg>
    );
}

// ─── 耳朵 ──────────────────────────────

function Ears({ type, c }) {
    switch (type) {
        case 'bear':
            return (<g>
                <circle cx="30" cy="28" r="11" fill={c.body} />
                <circle cx="30" cy="28" r="6" fill={c.light} opacity="0.5" />
                <circle cx="70" cy="28" r="11" fill={c.body} />
                <circle cx="70" cy="28" r="6" fill={c.light} opacity="0.5" />
            </g>);
        case 'rabbit':
            return (<g>
                <ellipse cx="38" cy="14" rx="7" ry="20" fill={c.body} />
                <ellipse cx="38" cy="14" rx="4" ry="14" fill="#FDA4AF" opacity="0.5" />
                <ellipse cx="62" cy="14" rx="7" ry="20" fill={c.body} />
                <ellipse cx="62" cy="14" rx="4" ry="14" fill="#FDA4AF" opacity="0.5" />
            </g>);
        case 'dog':
            return (<g>
                <ellipse cx="27" cy="40" rx="10" ry="15" fill={c.body} transform="rotate(-10,27,40)" />
                <ellipse cx="73" cy="40" rx="10" ry="15" fill={c.body} transform="rotate(10,73,40)" />
            </g>);
        case 'cat':
            return (<g>
                <polygon points="32,35 25,12 44,28" fill={c.body} />
                <polygon points="34,32 29,17 42,29" fill="#FDA4AF" opacity="0.4" />
                <polygon points="68,35 75,12 56,28" fill={c.body} />
                <polygon points="66,32 71,17 58,29" fill="#FDA4AF" opacity="0.4" />
            </g>);
        case 'bird':
            return (<g>
                <ellipse cx="50" cy="16" rx="3" ry="8" fill={c.body} />
                <ellipse cx="46" cy="18" rx="2" ry="6" fill={c.body} transform="rotate(-10,46,18)" />
                <ellipse cx="54" cy="18" rx="2" ry="6" fill={c.body} transform="rotate(10,54,18)" />
            </g>);
        case 'horse':
            return (<g>
                <ellipse cx="37" cy="22" rx="5" ry="11" fill={c.body} transform="rotate(-8,37,22)" />
                <ellipse cx="63" cy="22" rx="5" ry="11" fill={c.body} transform="rotate(8,63,22)" />
                {/* 鬃毛 */}
                <ellipse cx="50" cy="20" rx="12" ry="7" fill={c.light} opacity="0.7" />
            </g>);
        case 'monkey':
            return (<g>
                <circle cx="22" cy="45" r="11" fill={c.body} />
                <circle cx="22" cy="45" r="7" fill={c.light} opacity="0.5" />
                <circle cx="78" cy="45" r="11" fill={c.body} />
                <circle cx="78" cy="45" r="7" fill={c.light} opacity="0.5" />
            </g>);
        default: return null;
    }
}

// ─── 腳 ──────────────────────────────

function Legs({ type, c, isHappy }) {
    if (type === 'bird') {
        return (<g>
            <line x1="42" y1="120" x2="42" y2="138" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <line x1="58" y1="120" x2="58" y2="138" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <line x1="36" y1="138" x2="48" y2="138" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="52" y1="138" x2="64" y2="138" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </g>);
    }
    return (<g>
        {/* 左腳 */}
        <ellipse cx="38" cy="120" rx="9" ry="6" fill={c.body} />
        <ellipse cx="38" cy="122" rx="7" ry="4" fill={c.belly} opacity="0.5" />
        {/* 右腳 */}
        <ellipse cx="62" cy="120" rx="9" ry="6" fill={c.body} />
        <ellipse cx="62" cy="122" rx="7" ry="4" fill={c.belly} opacity="0.5" />
    </g>);
}

// ─── 尾巴 ──────────────────────────────

function Tail({ type, c }) {
    switch (type) {
        case 'bear':
            return <circle cx="72" cy="115" r="5" fill={c.body} />;
        case 'rabbit':
            return <circle cx="72" cy="112" r="6" fill="white" opacity="0.8" />;
        case 'dog':
            return (<path d="M 72 100 Q 82 90 85 100 Q 82 105 75 108"
                fill={c.body} className="tail-wag" />);
        case 'cat':
            return (<path d="M 72 105 Q 88 95 85 110 Q 82 120 78 115"
                fill={c.body} stroke={c.body} strokeWidth="3"
                strokeLinecap="round" className="tail-wag" />);
        case 'monkey':
            return (<path d="M 72 105 Q 90 100 88 115 Q 85 130 80 125"
                fill="none" stroke={c.body} strokeWidth="4"
                strokeLinecap="round" className="tail-wag" />);
        default: return null;
    }
}

// ─── 臉部細節 ──────────────────────────

function FaceDetail({ type, c }) {
    switch (type) {
        case 'cat':
            return (<g stroke="#94a3b8" strokeWidth="1" opacity="0.4">
                <line x1="35" y1="52" x2="18" y2="50" />
                <line x1="35" y1="55" x2="18" y2="56" />
                <line x1="65" y1="52" x2="82" y2="50" />
                <line x1="65" y1="55" x2="82" y2="56" />
            </g>);
        case 'monkey':
            return <circle cx="50" cy="53" r="18" fill={c.light} opacity="0.6" />;
        default: return null;
    }
}

// ─── 表情系統 ──────────────────────────

function Expression({ mood }) {
    const isHappy = mood === 'happy' || mood === 'excited';
    const isSad = mood === 'sad';

    if (isHappy) {
        return (<g>
            <g stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round">
                <path d="M 39 42 Q 44 36 49 42" />
                <path d="M 51 42 Q 56 36 61 42" />
            </g>
            <circle cx="35" cy="52" r="4.5" fill="#FECACA" opacity="0.6" />
            <circle cx="65" cy="52" r="4.5" fill="#FECACA" opacity="0.6" />
            <path d="M 42 56 Q 50 65 58 56" stroke="#1e293b" strokeWidth="2"
                fill="#FECACA" strokeLinecap="round" />
        </g>);
    }
    if (isSad) {
        return (<g>
            <g stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <path d="M 39 44 Q 44 48 49 44" />
                <path d="M 51 44 Q 56 48 61 44" />
            </g>
            <path d="M 43 60 Q 50 55 57 60" stroke="#475569" strokeWidth="1.8"
                fill="none" strokeLinecap="round" />
        </g>);
    }
    return (<g>
        <circle cx="43" cy="42" r="3.5" fill="#1e293b" />
        <circle cx="57" cy="42" r="3.5" fill="#1e293b" />
        <circle cx="44" cy="40.5" r="1.2" fill="white" />
        <circle cx="58" cy="40.5" r="1.2" fill="white" />
        <path d="M 43 56 Q 50 62 57 56" stroke="#475569" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
    </g>);
}

// ─── 鼻子 ──────────────────────────────

function Nose({ type }) {
    if (type === 'bird') {
        return <polygon points="50,48 45,53 55,53" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />;
    }
    if (type === 'dog') {
        return <ellipse cx="50" cy="51" rx="4" ry="3" fill="#1e293b" />;
    }
    return (<g>
        <ellipse cx="50" cy="51" rx="3.5" ry="2.5" fill="#4a3728" />
        <ellipse cx="51" cy="50.2" rx="1.5" ry="1" fill="#6b5244" opacity="0.5" />
    </g>);
}

// ─── 年級配件 ──────────────────────────

function GradeAccessories({ grade }) {
    if (grade <= 1) return null;
    return (<g>
        {grade >= 2 && (
            <g transform="translate(50,68)">
                <path d="M -7 0 C -7 -5 -1 -5 0 0 C 1 -5 7 -5 7 0 C 7 5 1 5 0 0 C -1 5 -7 5 -7 0 Z"
                    fill="#F43F5E" />
                <circle r="2.5" fill="#FB7185" />
            </g>
        )}
        {grade >= 3 && (
            <path d="M 32 70 Q 50 76 68 70" stroke="#22C55E" strokeWidth="4"
                fill="none" strokeLinecap="round" opacity="0.65" />
        )}
        {grade >= 4 && grade < 5 && (
            <g>
                <path d="M 38 25 L 50 5 L 62 25 Z" fill="#F87171" stroke="#EF4444" strokeWidth="1" />
                <circle cx="50" cy="5" r="3" fill="#FBBF24" />
            </g>
        )}
        {grade >= 5 && (
            <g transform="translate(50,18)">
                <path d="M -12 5 L -8 -6 L 0 1 L 8 -6 L 12 5 Z"
                    fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
                <circle cx="-8" cy="-6" r="1.5" fill="#EF4444" />
                <circle cx="0" cy="1" r="1.5" fill="#3B82F6" />
                <circle cx="8" cy="-6" r="1.5" fill="#10B981" />
            </g>
        )}
        {grade >= 6 && (
            <g opacity="0.8">
                <circle cx="50" cy="8" r="2.5" fill="#FBBF24">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="38" cy="12" r="1.5" fill="#FCD34D">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="62" cy="12" r="1.5" fill="#FCD34D">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>
            </g>
        )}
    </g>);
}
