import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    collection, doc, getDocs, setDoc, deleteDoc, getDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

const OP_LABELS = {
    '+': '加法',
    '-': '減法',
    '×': '乘法',
    '÷': '除法',
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeGrade, setActiveGrade] = useState(1);
    const [questions, setQuestions] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        level: 1,
        label: '',
        ops: ['+'],
        min: 1,
        max: 10,
        msg: '',
        decimal: false,
        fraction: false,
        percent: false,
        ratio: false,
    });

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                loadQuestions();
            } else {
                navigate('/admin/login');
            }
            setLoading(false);
        });
    }, []);

    const loadQuestions = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'questionBanks'));
            const data = {};
            snapshot.forEach(doc => {
                data[doc.id] = doc.data();
            });
            // Merge with defaults
            const merged = {};
            for (let g = 1; g <= 6; g++) {
                const key = `grade${g}`;
                if (data[key] && data[key].levels && data[key].levels.length > 0) {
                    merged[g] = data[key];
                } else {
                    merged[g] = DEFAULT_QUESTIONS[g];
                }
            }
            setQuestions(merged);
        } catch (err) {
            console.error('Error loading questions:', err);
            // Use defaults if Firestore fails
            setQuestions({ ...DEFAULT_QUESTIONS });
        }
    };

    const saveGrade = async (grade, data) => {
        try {
            await setDoc(doc(db, 'questionBanks', `grade${grade}`), data);
        } catch (err) {
            console.error('Error saving:', err);
        }
    };

    const handleAddNew = () => {
        const gradeData = questions[activeGrade];
        const levels = gradeData?.levels || [];
        const nextLevel = levels.length > 0 ? Math.max(...levels.map(l => l.level)) + 1 : 1;
        setFormData({
            level: nextLevel,
            label: '',
            ops: ['+'],
            min: 1,
            max: 10,
            msg: '加油！',
            decimal: false,
            fraction: false,
            percent: false,
            ratio: false,
        });
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item, index) => {
        setFormData({ ...item });
        setEditingItem(index);
        setShowForm(true);
    };

    const handleDelete = async (index) => {
        if (!confirm('確定要刪除這個題型嗎？')) return;
        const gradeData = { ...questions[activeGrade] };
        const levels = [...(gradeData.levels || [])];
        levels.splice(index, 1);
        gradeData.levels = levels;
        const newQuestions = { ...questions, [activeGrade]: gradeData };
        setQuestions(newQuestions);
        await saveGrade(activeGrade, gradeData);
    };

    const handleSaveForm = async () => {
        const gradeData = { ...questions[activeGrade] };
        const levels = [...(gradeData.levels || [])];

        if (editingItem !== null) {
            levels[editingItem] = { ...formData };
        } else {
            levels.push({ ...formData });
        }

        // Re-sort by level
        levels.sort((a, b) => a.level - b.level);
        gradeData.levels = levels;

        const newQuestions = { ...questions, [activeGrade]: gradeData };
        setQuestions(newQuestions);
        await saveGrade(activeGrade, gradeData);
        setShowForm(false);
    };

    const handleExportCSV = () => {
        const gradeData = questions[activeGrade];
        const levels = gradeData?.levels || [];
        const header = 'level,label,ops,min,max,msg,decimal,fraction,percent,ratio';
        const rows = levels.map(l =>
            `${l.level},"${l.label || ''}","${(l.ops || []).join('')}",${l.min || 1},${l.max || 10},"${l.msg || ''}",${l.decimal || false},${l.fraction || false},${l.percent || false},${l.ratio || false}`
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grade${activeGrade}_questions.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportCSV = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        const rows = text.split('\n').slice(1).filter(r => r.trim());
        const newLevels = rows.map(row => {
            const cols = row.split(',').map(c => c.replace(/"/g, '').trim());
            return {
                level: parseInt(cols[0]) || 1,
                label: cols[1] || '',
                ops: (cols[2] || '+').split(''),
                min: parseInt(cols[3]) || 1,
                max: parseInt(cols[4]) || 10,
                msg: cols[5] || '加油！',
                decimal: cols[6] === 'true',
                fraction: cols[7] === 'true',
                percent: cols[8] === 'true',
                ratio: cols[9] === 'true',
            };
        });
        if (newLevels.length > 0) {
            const gradeData = { ...questions[activeGrade], levels: newLevels };
            const newQuestions = { ...questions, [activeGrade]: gradeData };
            setQuestions(newQuestions);
            await saveGrade(activeGrade, gradeData);
        }
        e.target.value = '';
    };

    const handleResetDefaults = async () => {
        if (!confirm('確定要重置為預設題庫嗎？這將覆蓋目前的自訂題目。')) return;
        const defaultData = DEFAULT_QUESTIONS[activeGrade];
        const newQuestions = { ...questions, [activeGrade]: defaultData };
        setQuestions(newQuestions);
        await saveGrade(activeGrade, defaultData);
    };

    const toggleOp = (op) => {
        setFormData(prev => {
            const ops = [...prev.ops];
            const idx = ops.indexOf(op);
            if (idx >= 0) {
                if (ops.length > 1) ops.splice(idx, 1);
            } else {
                ops.push(op);
            }
            return { ...prev, ops };
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p style={{ fontWeight: 700, color: '#94a3b8' }}>載入中...</p>
            </div>
        );
    }

    const currentLevels = questions[activeGrade]?.levels || [];

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <h1>🌲 數學森林管理後台</h1>
                <div className="admin-header-actions">
                    <button
                        className="admin-header-btn"
                        style={{ background: '#f1f5f9', color: '#64748b' }}
                        onClick={() => navigate('/')}
                    >
                        🎮 前台
                    </button>
                    <button
                        className="admin-header-btn"
                        style={{ background: '#fee2e2', color: '#ef4444' }}
                        onClick={() => signOut(auth)}
                    >
                        登出
                    </button>
                </div>
            </div>

            <div className="admin-body">
                {/* 年級 Tab */}
                <div className="grade-tabs">
                    {[1, 2, 3, 4, 5, 6].map(g => (
                        <button
                            key={g}
                            className={`grade-tab ${activeGrade === g ? 'active' : ''}`}
                            onClick={() => setActiveGrade(g)}
                        >
                            {DEFAULT_QUESTIONS[g].emoji} {DEFAULT_QUESTIONS[g].name}
                        </button>
                    ))}
                </div>

                {/* 工具列 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '8px',
                }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            className="admin-header-btn"
                            style={{ background: '#dcfce7', color: '#16a34a' }}
                            onClick={handleAddNew}
                        >
                            ＋ 新增題型
                        </button>
                        <button
                            className="admin-header-btn"
                            style={{ background: '#e0f2fe', color: '#0284c7' }}
                            onClick={handleExportCSV}
                        >
                            📥 匯出 CSV
                        </button>
                        <label
                            className="admin-header-btn"
                            style={{ background: '#fef3c7', color: '#d97706', cursor: 'pointer' }}
                        >
                            📤 匯入 CSV
                            <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
                        </label>
                    </div>
                    <button
                        className="admin-header-btn"
                        style={{ background: '#fef2f2', color: '#ef4444', fontSize: '0.8rem' }}
                        onClick={handleResetDefaults}
                    >
                        重置預設
                    </button>
                </div>

                {/* 題目清單 */}
                {currentLevels.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state-emoji">📝</span>
                        <p className="empty-state-text">還沒有任何題型</p>
                        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                            點擊「新增題型」開始建立題庫
                        </p>
                    </div>
                ) : (
                    <div className="question-list">
                        {currentLevels.map((item, index) => (
                            <div key={index} className="question-item">
                                <div className="question-item-content">
                                    <span className="question-item-type">LV.{item.level}</span>
                                    <span className="question-item-preview">{item.label || '未命名'}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                                        {(item.ops || []).join(' ')} | {item.min}~{item.max}
                                        {item.decimal && ' 📊小數'}
                                        {item.fraction && ' 🔢分數'}
                                        {item.percent && ' 💯百分比'}
                                        {item.ratio && ' ⚖比率'}
                                    </span>
                                </div>
                                <div className="question-item-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(item, index)}>✏️</button>
                                    <button className="btn-delete" onClick={() => handleDelete(index)}>🗑</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 新增/編輯表單 */}
            {showForm && (
                <div className="question-form-overlay" onClick={() => setShowForm(false)}>
                    <div className="question-form" onClick={e => e.stopPropagation()}>
                        <h3>{editingItem !== null ? '✏️ 編輯題型' : '➕ 新增題型'}</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>等級</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.level}
                                    onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                            <div className="form-group">
                                <label>題型名稱</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="例：10以內加法"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>運算符號</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['+', '-', '×', '÷'].map(op => (
                                    <button
                                        key={op}
                                        onClick={() => toggleOp(op)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: '2px solid',
                                            borderColor: formData.ops.includes(op) ? '#22c55e' : '#e2e8f0',
                                            borderRadius: '12px',
                                            background: formData.ops.includes(op) ? '#dcfce7' : 'white',
                                            fontFamily: 'var(--font-main)',
                                            fontWeight: 800,
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            color: formData.ops.includes(op) ? '#16a34a' : '#94a3b8',
                                        }}
                                    >
                                        {op}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>最小值</label>
                                <input
                                    type="number"
                                    value={formData.min}
                                    onChange={e => setFormData({ ...formData, min: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                            <div className="form-group">
                                <label>最大值</label>
                                <input
                                    type="number"
                                    value={formData.max}
                                    onChange={e => setFormData({ ...formData, max: parseInt(e.target.value) || 10 })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>特殊題型</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { key: 'decimal', label: '📊 小數' },
                                    { key: 'fraction', label: '🔢 分數' },
                                    { key: 'percent', label: '💯 百分比' },
                                    { key: 'ratio', label: '⚖ 比率' },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setFormData({ ...formData, [key]: !formData[key] })}
                                        style={{
                                            padding: '8px 14px',
                                            border: '2px solid',
                                            borderColor: formData[key] ? '#22c55e' : '#e2e8f0',
                                            borderRadius: '10px',
                                            background: formData[key] ? '#dcfce7' : 'white',
                                            fontFamily: 'var(--font-main)',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            color: formData[key] ? '#16a34a' : '#94a3b8',
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>鼓勵語</label>
                            <input
                                type="text"
                                value={formData.msg}
                                onChange={e => setFormData({ ...formData, msg: e.target.value })}
                                placeholder="例：加油！你做得很好！"
                            />
                        </div>

                        <div className="form-actions">
                            <button className="form-btn-cancel" onClick={() => setShowForm(false)}>取消</button>
                            <button className="form-btn-save" onClick={handleSaveForm}>
                                {editingItem !== null ? '更新' : '新增'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
