import { useEffect, useState } from 'react';

const AdminApprovals = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/pending-payments`, {
                credentials: 'include',
            });
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error(err);
            setMessage('불러오기 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setMessage('');
        const confirm = window.confirm('정말로 이 결제를 승인하시겠습니까?');
        if (!confirm) return;

        try {
            const txHash = prompt('승인할 txHash를 확인 후 입력하세요:');
            if (!txHash || txHash.length < 10) {
                alert('유효한 txHash를 입력하세요.');
                return;
            }

            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/approve-payment/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ txHash }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setMessage('✅ 결제 승인이 완료되었습니다.');
            fetchPendingRequests();
        } catch (err) {
            console.error(err);
            setMessage(err.message || '❌ 승인 실패');
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6">🛡️ 결제 승인 (관리자)</h2>

            {loading ? (
                <p>불러오는 중...</p>
            ) : requests.length === 0 ? (
                <p className="text-gray-500">승인 대기 중인 결제가 없습니다.</p>
            ) : (
                <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">상점</th>
                        <th className="p-2 border">금액</th>
                        <th className="p-2 border">지갑주소</th>
                        <th className="p-2 border">요청시각</th>
                        <th className="p-2 border">승인</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((r) => (
                        <tr key={r.id}>
                            <td className="p-2 border text-xs">{r.id.slice(0, 6)}...</td>
                            <td className="p-2 border">{r.merchantName}</td>
                            <td className="p-2 border">{r.amount} USDT</td>
                            <td className="p-2 border text-xs break-all">{r.walletAddress}</td>
                            <td className="p-2 border">{new Date(r.createdAt).toLocaleString()}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleApprove(r.id)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    승인
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {message && (
                <p className={`text-sm mt-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AdminApprovals;
