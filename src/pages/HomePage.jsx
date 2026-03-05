import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DEFAULT_QUESTIONS, GRADE_EMOJIS, GRADE_NAMES, GRADE_DESCS } from '../data/defaultQuestions';

const FLOATING_LEAVES = ['🍃', '🌿', '🍂', '🌸', '✨', '🦋'];

export default function HomePage() {
    const navigate = useNavigate();
    const grades = Object.entries(DEFAULT_QUESTIONS);

    return (
        <div className="home-container">
            {/* 浮動裝飾 */}
            {Array.from({ length: 8 }).map((_, i) => (
                <span
                    key={i}
                    className="floating-leaf"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        fontSize: `${1 + Math.random() * 1.5}rem`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${4 + Math.random() * 3}s`,
                    }}
                >
                    {FLOATING_LEAVES[i % FLOATING_LEAVES.length]}
                </span>
            ))}

            <div className="home-header">
                <h1 className="home-title">🌲 數學森林</h1>
                <p className="home-subtitle">選擇年級，開始冒險吧！</p>
            </div>

            <div className="grade-grid">
                {grades.map(([gradeNum, data]) => (
                    <button
                        key={gradeNum}
                        className="grade-card"
                        onClick={() => navigate(`/game/${gradeNum}`)}
                        style={{ '--card-accent': data.color }}
                    >
                        <span className="grade-emoji">{data.emoji}</span>
                        <div className="grade-label">{data.name}</div>
                        <div className="grade-desc">{data.desc}</div>
                    </button>
                ))}
            </div>

            {/* 底部 — 小熊陪你選 */}
            <div style={{ textAlign: 'center', padding: '20px 0 40px', position: 'relative', zIndex: 1 }}>
                <svg viewBox="0 0 200 200" style={{ width: '100px', height: '100px', margin: '0 auto' }}>
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
                <p style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem', marginTop: '8px' }}>
                    嗨！我是小熊，跟我一起學數學吧！
                </p>
            </div>

            <Link to="/admin/login" className="admin-link">🔧 管理後台</Link>
        </div>
    );
}
