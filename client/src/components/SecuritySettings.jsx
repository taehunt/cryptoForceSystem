import { useState } from 'react';

const SecuritySettings = () => {
    const [showForm, setShowForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('❌ 새 비밀번호가 일치하지 않습니다.');
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

            setMessage('✅ 비밀번호가 성공적으로 변경되었습니다.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage(err.message || '❌ 오류 발생');
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => setShowForm(prev => !prev)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                비밀번호 변경
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border space-y-4 max-w-md">
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
                    {message && (
                        <p className={`text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};

export default SecuritySettings;
