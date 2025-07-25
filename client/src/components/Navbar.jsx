import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow">
            <nav className="flex justify-between items-center p-4 bg-gray-100 border-b">
                <h1
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    💰 Crypto Force System
                </h1>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <button
                                onClick={() => navigate('/mypage')}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                마이페이지
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            로그인
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}
