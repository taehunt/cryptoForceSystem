import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MyPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwMessage, setPwMessage] = useState('');

    // 로그인 안된 상태면 redirect
    useEffect(() => {
        if (user === false) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (user === null) return <div className="p-6 text-center">로딩 중...</div>;

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwMessage('');

        if (newPassword !== confirmPassword) {
            setPwMessage('❌ 새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setPwMessage('✅ 비밀번호가 성공적으로 변경되었습니다.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPwMessage(err.message || '❌ 오류 발생');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
            <h2 className="text-2xl font-bold mb-4">마이페이지</h2>

            <div className="mb-6 space-y-1">
                <p><span className="font-semibold">아이디:</span> {user.id}</p>
                <p><span className="font-semibold">이메일:</span> {user.email}</p>
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowPasswordForm(prev => !prev)}
                >
                    비밀번호 변경
                </button>
                <button
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                    disabled
                >
                    지갑주소 변경 (준비 중)
                </button>
            </div>

            {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="bg-gray-50 p-4 rounded border space-y-4">
                    <h3 className="text-lg font-semibold">비밀번호 변경</h3>

                    <input
                        type="password"
                        placeholder="현재 비밀번호"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        비밀번호 변경하기
                    </button>
                    {pwMessage && (
                        <p className={`text-sm ${pwMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                            {pwMessage}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};

export default MyPage;
