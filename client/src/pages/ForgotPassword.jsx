import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || '오류 발생');
            setDone(true);
        } catch (err) {
            setError(err.message);
        }
    };

    if (done) return <p>재설정 링크가 이메일로 전송되었습니다.</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>비밀번호 재설정</h2>
            <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">링크 전송</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default ForgotPassword;
