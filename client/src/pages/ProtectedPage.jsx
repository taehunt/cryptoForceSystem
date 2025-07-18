// 경로: client/src/pages/ProtectedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <div>로딩 중...</div>;

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🔒 보호된 사용자 페이지</h1>
            <p>로그인한 사용자 ID: {user.id}</p>
        </div>
    );
}
