import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentRequest = () => {
    const [merchants, setMerchants] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const res = await axios.get('/api/merchants');
                setMerchants(res.data);
            } catch (err) {
                console.error('가맹점 목록 불러오기 실패:', err);
            }
        };

        fetchMerchants();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMerchant || !amount) {
            setStatus('모든 항목을 입력해주세요.');
            return;
        }

        try {
            const res = await axios.post('/api/payments/request', {
                merchantId: selectedMerchant,
                amount,
                message,
            });

            if (res.data.success) {
                setStatus('결제 요청이 성공적으로 접수되었습니다.');
                setAmount('');
                setMessage('');
            } else {
                setStatus('요청 실패: ' + (res.data.error || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error(err);
            setStatus('요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">결제 요청</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block font-medium mb-1">가맹점 선택</label>
                    <select
                        value={selectedMerchant}
                        onChange={(e) => setSelectedMerchant(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">선택하세요</option>
                        {merchants.map((merchant) => (
                            <option key={merchant._id} value={merchant._id}>
                                {merchant.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">결제 금액 (USDT)</label>
                    <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">메시지 (선택)</label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    결제 요청
                </button>
                {status && <p className="mt-4 text-sm text-gray-800">{status}</p>}
            </form>
        </div>
    );
};

export default PaymentRequest;
