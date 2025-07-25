import { useEffect, useState } from 'react';

const AdminApprovals = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/payments/pending`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setPayments(data))
            .catch(console.error);
    }, []);

    const handleApprove = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/payments/${id}/approve`, {
            method: 'POST',
            credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
            setPayments(prev => prev.filter(p => p.id !== id));
            alert('승인 완료');
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">결제 요청 승인</h2>
            {payments.length === 0 ? (
                <p>대기 중인 결제 요청이 없습니다.</p>
            ) : (
                <table className="w-full border">
                    <thead>
                    <tr>
                        <th>요청 ID</th>
                        <th>금액</th>
                        <th>지갑주소</th>
                        <th>상점 ID</th>
                        <th>승인</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.amount}</td>
                            <td>{p.walletAddress}</td>
                            <td>{p.merchantId}</td>
                            <td>
                                <button
                                    onClick={() => handleApprove(p.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    승인
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminApprovals;
