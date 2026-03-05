import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('找不到此帳號');
                    break;
                case 'auth/wrong-password':
                    setError('密碼錯誤');
                    break;
                case 'auth/invalid-email':
                    setError('Email 格式不正確');
                    break;
                case 'auth/too-many-requests':
                    setError('登入嘗試太多次，請稍後再試');
                    break;
                default:
                    setError('登入失敗：' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌲</div>
                <h1>數學森林管理後台</h1>
                <p>請輸入管理員帳號密碼</p>

                {error && <div className="admin-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        className="admin-input"
                        placeholder="管理員 Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="admin-input"
                        placeholder="密碼"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="admin-btn" disabled={loading}>
                        {loading ? '登入中...' : '登入'}
                    </button>
                </form>

                <div style={{ marginTop: '24px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            fontWeight: 700,
                            fontFamily: 'var(--font-main)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}
                    >
                        ← 回到遊戲首頁
                    </button>
                </div>
            </div>
        </div>
    );
}
