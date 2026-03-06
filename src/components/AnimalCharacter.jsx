import React from 'react';

/**
 * 森林動物角色（Q版大頭）— 頭約身體 2 倍大
 * viewBox: 0 0 100 130
 * 頭: cx=50, cy=40, r=32
 * 身體: cx=50, cy=100, rx=16, ry=18
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
        <svg viewBox="0 0 100 115" className="animal-char">
            {/* ── 年級配件 ── */}
            <GradeAccessories grade={grade} />

            {/* ── 耳朵（在頭後面） ── */}
            <Ears type={type} c={c} />

            {/* ── 大頭 (r=32) ── */}
            <circle cx="50" cy="40" r="32" fill={c.body} />
            <circle cx="50" cy="48" r="20" fill={c.light} opacity="0.4" />

            {/* ── 臉部特徵 ── */}
            <FaceDetail type={type} c={c} />
            <Expression mood={mood} />
            <Nose type={type} />

            {/* ── 小身體 (rx=16, ry=18) ── */}
            <ellipse cx="50" cy="85" rx="16" ry="18" fill={c.body} />
            <ellipse cx="50" cy="87" rx="10" ry="12" fill={c.belly} opacity="0.55" />

            {/* ── 小腳 ── */}
            <Legs type={type} c={c} />

            {/* ── 手臂 ── */}
            <g className="animal-arm-left">
                <path d={type === 'bird'
                    ? "M 34 78 Q 22 70 18 78 Q 22 86 34 82"
                    : "M 34 80 Q 24 74 22 82 Q 24 90 34 86"}
                    fill={c.body} />
            </g>
            <g className="animal-arm-right">
                <path d={type === 'bird'
                    ? "M 66 78 Q 78 70 82 78 Q 78 86 66 82"
                    : "M 66 80 Q 76 74 78 82 Q 76 90 66 86"}
                    fill={c.body} />
            </g>

            {/* ── 尾巴 ── */}
            <Tail type={type} c={c} />

            {/* ── 答對星星 ── */}
            {isHappy && (
                <g className="celebrate-stars">
                    <text x="5" y="18" fontSize="10" opacity="0.8">⭐</text>
                    <text x="82" y="14" fontSize="8" opacity="0.6">✨</text>
                    <text x="2" y="55" fontSize="7" opacity="0.5">🌟</text>
                </g>
            )}

            {/* ── 答錯汗滴 ── */}
            {isSad && (
                <ellipse cx="78" cy="30" rx="2" ry="3.5" fill="#93C5FD" opacity="0.7">
                    <animate attributeName="cy" values="28;42;28" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite" />
                </ellipse>
            )}
        </svg>
    );
}

// ─── 耳朵 ──────────────────────────────

function Ears({ type, c }) {
    switch (type) {
        case 'bear':
            return (<g>
                <circle cx="24" cy="18" r="13" fill={c.body} />
                <circle cx="24" cy="18" r="7" fill={c.light} opacity="0.5" />
                <circle cx="76" cy="18" r="13" fill={c.body} />
                <circle cx="76" cy="18" r="7" fill={c.light} opacity="0.5" />
            </g>);
        case 'rabbit':
            return (<g>
                <ellipse cx="36" cy="4" rx="8" ry="24" fill={c.body} />
                <ellipse cx="36" cy="4" rx="4.5" ry="17" fill="#FDA4AF" opacity="0.5" />
                <ellipse cx="64" cy="4" rx="8" ry="24" fill={c.body} />
                <ellipse cx="64" cy="4" rx="4.5" ry="17" fill="#FDA4AF" opacity="0.5" />
            </g>);
        case 'dog':
            return (<g>
                <ellipse cx="22" cy="36" rx="11" ry="18" fill={c.body} transform="rotate(-15,22,36)" />
                <ellipse cx="78" cy="36" rx="11" ry="18" fill={c.body} transform="rotate(15,78,36)" />
            </g>);
        case 'cat':
            return (<g>
                <polygon points="26,30 18,2 42,22" fill={c.body} />
                <polygon points="28,26 22,8 40,23" fill="#FDA4AF" opacity="0.4" />
                <polygon points="74,30 82,2 58,22" fill={c.body} />
                <polygon points="72,26 78,8 60,23" fill="#FDA4AF" opacity="0.4" />
            </g>);
        case 'bird':
            return (<g>
                <ellipse cx="50" cy="4" rx="3" ry="9" fill={c.body} />
                <ellipse cx="45" cy="6" rx="2.5" ry="7" fill={c.body} transform="rotate(-12,45,6)" />
                <ellipse cx="55" cy="6" rx="2.5" ry="7" fill={c.body} transform="rotate(12,55,6)" />
            </g>);
        case 'horse':
            return (<g>
                <ellipse cx="34" cy="14" rx="6" ry="13" fill={c.body} transform="rotate(-10,34,14)" />
                <ellipse cx="66" cy="14" rx="6" ry="13" fill={c.body} transform="rotate(10,66,14)" />
                <ellipse cx="50" cy="10" rx="14" ry="8" fill={c.light} opacity="0.6" />
            </g>);
        case 'monkey':
            return (<g>
                <circle cx="16" cy="40" r="13" fill={c.body} />
                <circle cx="16" cy="40" r="8" fill={c.light} opacity="0.5" />
                <circle cx="84" cy="40" r="13" fill={c.body} />
                <circle cx="84" cy="40" r="8" fill={c.light} opacity="0.5" />
            </g>);
        default: return null;
    }
}

// ─── 腳 ──────────────────────────────

function Legs({ type, c }) {
    if (type === 'bird') {
        return (<g>
            <line x1="44" y1="101" x2="44" y2="112" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="56" y1="101" x2="56" y2="112" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="39" y1="112" x2="49" y2="112" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="51" y1="112" x2="61" y2="112" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </g>);
    }
    return (<g>
        <ellipse cx="40" cy="101" rx="8" ry="5" fill={c.body} />
        <ellipse cx="40" cy="102" rx="6" ry="3.5" fill={c.belly} opacity="0.5" />
        <ellipse cx="60" cy="101" rx="8" ry="5" fill={c.body} />
        <ellipse cx="60" cy="102" rx="6" ry="3.5" fill={c.belly} opacity="0.5" />
    </g>);
}

// ─── 尾巴 ──────────────────────────────

function Tail({ type, c }) {
    switch (type) {
        case 'bear':
            return <circle cx="66" cy="97" r="4" fill={c.body} />;
        case 'rabbit':
            return <circle cx="66" cy="95" r="5" fill="white" opacity="0.8" />;
        case 'dog':
            return (<path d="M 66 84 Q 76 74 78 84 Q 76 90 70 92"
                fill={c.body} className="tail-wag" />);
        case 'cat':
            return (<path d="M 66 90 Q 82 80 80 94 Q 78 104 74 98"
                fill={c.body} stroke={c.body} strokeWidth="2.5"
                strokeLinecap="round" className="tail-wag" />);
        case 'monkey':
            return (<path d="M 66 90 Q 84 84 82 98 Q 80 110 76 104"
                fill="none" stroke={c.body} strokeWidth="3.5"
                strokeLinecap="round" className="tail-wag" />);
        default: return null;
    }
}

// ─── 臉部細節 ──────────────────────────

function FaceDetail({ type, c }) {
    switch (type) {
        case 'cat':
            return (<g stroke="#94a3b8" strokeWidth="1" opacity="0.4">
                <line x1="36" y1="46" x2="16" y2="44" />
                <line x1="36" y1="49" x2="16" y2="50" />
                <line x1="64" y1="46" x2="84" y2="44" />
                <line x1="64" y1="49" x2="84" y2="50" />
            </g>);
        case 'monkey':
            return <circle cx="50" cy="48" r="22" fill={c.light} opacity="0.6" />;
        default: return null;
    }
}

// ─── 表情 ──────────────────────────────

function Expression({ mood }) {
    const isHappy = mood === 'happy' || mood === 'excited';
    const isSad = mood === 'sad';

    if (isHappy) {
        return (<g>
            <g stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round">
                <path d="M 36 36 Q 42 28 48 36" />
                <path d="M 52 36 Q 58 28 64 36" />
            </g>
            <circle cx="32" cy="48" r="5" fill="#FECACA" opacity="0.6" />
            <circle cx="68" cy="48" r="5" fill="#FECACA" opacity="0.6" />
            <path d="M 40 52 Q 50 63 60 52" stroke="#1e293b" strokeWidth="2.5"
                fill="#FECACA" strokeLinecap="round" />
        </g>);
    }
    if (isSad) {
        return (<g>
            <g stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <path d="M 36 38 Q 42 43 48 38" />
                <path d="M 52 38 Q 58 43 64 38" />
            </g>
            <path d="M 42 55 Q 50 49 58 55" stroke="#475569" strokeWidth="2"
                fill="none" strokeLinecap="round" />
        </g>);
    }
    return (<g>
        <circle cx="42" cy="36" r="4" fill="#1e293b" />
        <circle cx="58" cy="36" r="4" fill="#1e293b" />
        <circle cx="43.5" cy="34.5" r="1.5" fill="white" />
        <circle cx="59.5" cy="34.5" r="1.5" fill="white" />
        <path d="M 42 52 Q 50 59 58 52" stroke="#475569" strokeWidth="2"
            fill="none" strokeLinecap="round" />
    </g>);
}

// ─── 鼻子 ──────────────────────────────

function Nose({ type }) {
    if (type === 'bird') {
        return <polygon points="50,42 44,48 56,48" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />;
    }
    if (type === 'dog') {
        return <ellipse cx="50" cy="45" rx="4.5" ry="3.5" fill="#1e293b" />;
    }
    return (<g>
        <ellipse cx="50" cy="45" rx="4" ry="3" fill="#4a3728" />
        <ellipse cx="51.5" cy="44" rx="1.8" ry="1" fill="#6b5244" opacity="0.5" />
    </g>);
}

// ─── 年級配件 ──────────────────────────

function GradeAccessories({ grade }) {
    if (grade <= 1) return null;
    return (<g>
        {grade >= 2 && (
            <g transform="translate(50,58)">
                <path d="M -8 0 C -8 -5 -1 -5 0 0 C 1 -5 8 -5 8 0 C 8 5 1 5 0 0 C -1 5 -8 5 -8 0 Z"
                    fill="#F43F5E" />
                <circle r="2.5" fill="#FB7185" />
            </g>
        )}
        {grade >= 3 && (
            <path d="M 34 60 Q 50 66 66 60" stroke="#22C55E" strokeWidth="3.5"
                fill="none" strokeLinecap="round" opacity="0.6" />
        )}
        {grade >= 4 && grade < 5 && (
            <g>
                <path d="M 36 15 L 50 -5 L 64 15 Z" fill="#F87171" stroke="#EF4444" strokeWidth="1" />
                <circle cx="50" cy="-5" r="3" fill="#FBBF24" />
            </g>
        )}
        {grade >= 5 && (
            <g transform="translate(50,8)">
                <path d="M -14 5 L -9 -7 L 0 1 L 9 -7 L 14 5 Z"
                    fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
                <circle cx="-9" cy="-7" r="1.5" fill="#EF4444" />
                <circle cx="0" cy="1" r="1.5" fill="#3B82F6" />
                <circle cx="9" cy="-7" r="1.5" fill="#10B981" />
            </g>
        )}
        {grade >= 6 && (
            <g opacity="0.8">
                <circle cx="50" cy="-2" r="2.5" fill="#FBBF24">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="36" cy="2" r="1.5" fill="#FCD34D">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="64" cy="2" r="1.5" fill="#FCD34D">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>
            </g>
        )}
    </g>);
}
