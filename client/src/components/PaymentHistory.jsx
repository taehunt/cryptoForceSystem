import { useEffect, useState } from 'react';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payments/my-requests`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setPayments(data);
            } catch (err) {
                setError(err.message || '불러오기 실패');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div>
            <h3 className="font-semibold text-lg mb-4">💳 결제 요청 내역</h3>
            {loading ? (
                <p>불러오는 중...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : payments.length === 0 ? (
                <p className="text-gray-500">결제 요청 내역이 없습니다.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">상점</th>
                            <th className="p-2 border">금액</th>
                            <th className="p-2 border">상태</th>
                            <th className="p-2 border">txHash</th>
                            <th className="p-2 border">요청 일시</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.map((item) => (
                            <tr key={item._id}>
                                <td className="p-2 border">{item._id.slice(0, 6)}...</td>
                                <td className="p-2 border">{item.merchantName || '-'}</td>
                                <td className="p-2 border">{item.amount} USDT</td>
                                <td className="p-2 border">
                                    {item.status === 'pending' && '대기중'}
                                    {item.status === 'approved' && '승인됨'}
                                    {item.status === 'failed' && '실패'}
                                </td>
                                <td className="p-2 border text-xs break-all">
                                    {item.txHash ? (
                                        <a
                                            href={`https://etherscan.io/tx/${item.txHash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {item.txHash.slice(0, 10)}...
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="p-2 border">
                                    {new Date(item.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
