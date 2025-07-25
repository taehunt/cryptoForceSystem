import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || '오류 발생');
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (success) return <p>비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>새 비밀번호 설정</h2>
            <input
                type="password"
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">비밀번호 변경</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default ResetPassword;
