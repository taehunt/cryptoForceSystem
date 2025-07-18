// src/components/PasswordGate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordGate() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

        const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username: 'admin', password }), // ✅ username 포함되어야 함
        });

        console.log('📬 응답 상태:', res.status);

        if (res.ok) {
            navigate('/admin/dashboard');
        } else {
            setError('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="w-80 p-6 bg-white rounded shadow">
                <h2 className="text-xl font-semibold mb-4">관리자 로그인</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full border p-2 mb-3"
                />
                <button type="submit" className="w-full bg-black text-white py-2">로그인</button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}
