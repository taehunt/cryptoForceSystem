import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [deposits, setDeposits] = useState([]);
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

    const fetchDeposits = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/deposits`);
            const data = await res.json();

            // ✅ 배열만 setDeposits에 할당
            const depositList = Array.isArray(data)
                ? data
                : Array.isArray(data.deposits)
                    ? data.deposits
                    : [];

            setDeposits(depositList);
        } catch (err) {
            console.error('입금 내역 로딩 실패:', err);
            setDeposits([]); // 실패 시 빈 배열
        }
    };

    const handleApprove = async (id) => {
        await fetch(`${API_BASE}/api/admin/deposits/${id}/approve`, { method: 'POST' });
        fetchDeposits(); // 승인 후 목록 갱신
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🔐 관리자 대시보드</h1>

            <h2 className="text-xl font-semibold mb-2">입금 대기 목록</h2>
            <table className="w-full text-sm border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">지갑 주소</th>
                    <th className="p-2 border">금액</th>
                    <th className="p-2 border">상태</th>
                    <th className="p-2 border">액션</th>
                </tr>
                </thead>
                <tbody>
                {deposits.map((tx) => (
                    <tr key={tx.id}>
                        <td className="border p-2">{tx.id}</td>
                        <td className="border p-2">{tx.walletAddress}</td>
                        <td className="border p-2">{tx.amount}</td>
                        <td className="border p-2">{tx.status}</td>
                        <td className="border p-2">
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={() => handleApprove(tx.id)}
                            >
                                승인
                            </button>
                        </td>
                    </tr>
                ))}
                {deposits.length === 0 && (
                    <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-500">대기 중인 입금 없음</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
