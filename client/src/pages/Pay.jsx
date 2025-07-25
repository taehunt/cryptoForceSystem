import { useState, useEffect } from 'react';

export default function Pay() {
    const [wallet, setWallet] = useState('');
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState('');
    const [merchants, setMerchants] = useState([]);
    const [merchantId, setMerchantId] = useState('');
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState('');

    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

    useEffect(() => {
        fetch(`${API_BASE}/api/merchants`)
            .then(res => res.json())
            .then(data => setMerchants(data))
            .catch(() => setError('상점 목록을 불러올 수 없습니다.'));
    }, []);

    const connectWallet = async () => {
        setError('');
        if (!window.ethereum) return setError('MetaMask가 설치되어 있지 않습니다.');

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWallet(accounts[0]);
            setConnected(true);
        } catch {
            setError('지갑 연결 실패');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${API_BASE}/api/payments/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 쿠키 기반
                body: JSON.stringify({ merchantId, amount }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSuccess('✅ 결제 요청이 성공적으로 전송되었습니다.');
            setAmount('');
            setMerchantId('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 mt-12 bg-white shadow rounded space-y-6">
            <h2 className="text-2xl font-bold">Web3 결제</h2>

            <button
                onClick={connectWallet}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                {connected ? '지갑 재연결' : 'MetaMask 지갑 연결'}
            </button>

            {wallet && (
                <div className="text-green-600 font-mono text-sm break-all">
                    ✅ 연결된 지갑: {wallet}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">-- 상점 선택 --</option>
                    {merchants.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="결제 금액 (예: 100)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    결제 요청
                </button>
            </form>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
}
