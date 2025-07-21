import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

const Pay = () => {
    const [merchants, setMerchants] = useState([]);
    const [selected, setSelected] = useState('');
    const [amount, setAmount] = useState('');
    const [tokenType, setTokenType] = useState('USDT');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/api/payments/request`, {
                userId: 'test', // 실제 로그인된 유저 ID로 교체
                merchantId: selected,
                amount: parseFloat(amount),
                tokenType
            }, { withCredentials: true });
            alert('결제 요청 완료');
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert('요청 실패');
        }
    };

    useEffect(() => {
        const fetchMerchants = async () => {
            const res = await axios.get(`${API_BASE}/api/merchants`, { withCredentials: true });
            setMerchants(res.data);
        };
        fetchMerchants();
    }, []);

    return (
        <div className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">결제 요청</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select value={selected} onChange={(e) => setSelected(e.target.value)} required className="w-full border p-2">
                    <option value="">상점 선택</option>
                    {merchants.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                    ))}
                </select>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="금액" required className="w-full border p-2" />
                <select value={tokenType} onChange={(e) => setTokenType(e.target.value)} className="w-full border p-2">
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white py-2">요청</button>
            </form>
        </div>
    );
};

export default Pay;
