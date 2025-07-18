import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

export default function Login() {
    const [form, setForm] = useState({ id: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                return setError(data.message || '로그인 실패');
            }

            const data = await res.json();
            setUser(data);
            navigate('/');
        } catch {
            setError('로그인 중 오류 발생');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 border rounded">
            <h2 className="text-2xl font-bold mb-4">로그인</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="id"
                    placeholder="아이디"
                    value={form.id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    로그인
                </button>
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">계정이 없으신가요? </span>
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:underline text-sm"
                    >
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    );
}
