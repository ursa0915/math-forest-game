import React from 'react';

/**
 * 小熊角色元件 — 表情與裝扮隨遊戲狀態變化
 */
export default function BearCharacter({ mood = 'normal', level = 1, stars = 0 }) {
    const isExcited = mood === 'excited';

    return (
        <svg
            viewBox="0 0 200 200"
            className={`bear-svg ${isExcited ? 'excited' : ''}`}
        >
            {/* 帽子 (level >= 2) */}
            {level >= 2 && (
                <g>
                    <path d="M 75 58 L 100 15 L 125 58 Z" fill="#F87171" stroke="#EF4444" strokeWidth="2" />
                    <circle cx="100" cy="15" r="6" fill="#FBBF24" />
                </g>
            )}

            {/* 耳朵 */}
            <circle cx="58" cy="80" r="24" fill="#A0522D" />
            <circle cx="58" cy="80" r="14" fill="#DEB887" opacity="0.5" />
            <circle cx="142" cy="80" r="24" fill="#A0522D" />
            <circle cx="142" cy="80" r="14" fill="#DEB887" opacity="0.5" />

            {/* 身體 */}
            <circle cx="100" cy="130" r="68" fill="#A0522D" />

            {/* 臉部亮色區 */}
            <circle cx="100" cy="145" r="40" fill="#DEB887" opacity="0.4" />

            {/* 翅膀 (stars >= 100) */}
            {stars >= 100 && (
                <g opacity="0.6">
                    <ellipse cx="30" cy="120" rx="20" ry="35" fill="#c4b5fd" transform="rotate(-15, 30, 120)" />
                    <ellipse cx="170" cy="120" rx="20" ry="35" fill="#c4b5fd" transform="rotate(15, 170, 120)" />
                </g>
            )}

            {/* 皇冠 (stars >= 35) */}
            {stars >= 35 && level >= 4 && (
                <g transform="translate(100, 50)">
                    <path d="M -25 10 L -15 -10 L 0 5 L 15 -10 L 25 10 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="-15" cy="-10" r="3" fill="#EF4444" />
                    <circle cx="0" cy="5" r="3" fill="#3B82F6" />
                    <circle cx="15" cy="-10" r="3" fill="#10B981" />
                </g>
            )}

            {/* 眼鏡 (level >= 5) */}
            {level >= 5 && (
                <g stroke="#334155" strokeWidth="3.5" fill="rgba(255,255,255,0.2)" opacity="0.85">
                    <circle cx="78" cy="120" r="16" />
                    <circle cx="122" cy="120" r="16" />
                    <line x1="94" y1="120" x2="106" y2="120" />
                    <line x1="62" y1="117" x2="50" y2="112" />
                    <line x1="138" y1="117" x2="150" y2="112" />
                </g>
            )}

            {/* 表情 */}
            {mood === 'happy' || mood === 'excited' ? (
                <g>
                    {/* 開心眼睛 */}
                    <g stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round">
                        <path d="M 68 118 Q 78 106 88 118" />
                        <path d="M 112 118 Q 122 106 132 118" />
                    </g>
                    {/* 腮紅 */}
                    <circle cx="65" cy="140" r="10" fill="#FECACA" opacity="0.6" />
                    <circle cx="135" cy="140" r="10" fill="#FECACA" opacity="0.6" />
                    {/* 大笑嘴 */}
                    <path d="M 82 150 Q 100 172 118 150" stroke="#1e293b" strokeWidth="4" fill="#FECACA" strokeLinecap="round" />
                </g>
            ) : mood === 'sad' ? (
                <g>
                    {/* 難過眼睛 */}
                    <g stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round">
                        <path d="M 68 122 Q 78 130 88 122" />
                        <path d="M 112 122 Q 122 130 132 122" />
                    </g>
                    {/* 噘嘴 */}
                    <path d="M 85 160 Q 100 148 115 160" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* 淚滴 */}
                    <path d="M 88 128 Q 86 136 88 142" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
                </g>
            ) : (
                <g>
                    {/* 正常眼睛 */}
                    <circle cx="78" cy="120" r="7" fill="#1e293b" />
                    <circle cx="122" cy="120" r="7" fill="#1e293b" />
                    <circle cx="80" cy="117" r="2.5" fill="white" />
                    <circle cx="124" cy="117" r="2.5" fill="white" />
                    {/* 微笑 */}
                    <path d="M 85 152 Q 100 164 115 152" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>
            )}

            {/* 鼻子 */}
            <ellipse cx="100" cy="138" rx="8" ry="6" fill="#4a3728" />
            <ellipse cx="102" cy="136" rx="3" ry="2" fill="#6b5244" opacity="0.5" />

            {/* 蝴蝶結 (level >= 3) */}
            {level >= 3 && (
                <g transform="translate(100, 188)">
                    <path d="M -18 0 C -18 -10 -2 -10 0 0 C 2 -10 18 -10 18 0 C 18 10 2 10 0 0 C -2 10 -18 10 -18 0 Z" fill="#F43F5E" />
                    <circle r="5" fill="#FB7185" />
                </g>
            )}

            {/* 魔法棒 (stars >= 75) */}
            {stars >= 75 && (
                <g transform="translate(160, 155) rotate(30)">
                    <rect x="-3" y="0" width="6" height="35" rx="3" fill="#8B5CF6" />
                    <polygon points="0,-12 4,-4 12,-4 5,2 8,10 0,5 -8,10 -5,2 -12,-4 -4,-4" fill="#FBBF24" />
                </g>
            )}

            {/* 星星光環 (stars >= 150) */}
            {stars >= 150 && (
                <g opacity="0.8">
                    <circle cx="100" cy="45" r="5" fill="#FBBF24">
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="85" cy="50" r="3" fill="#FCD34D">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="115" cy="50" r="3" fill="#FCD34D">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                </g>
            )}
        </svg>
    );
}
