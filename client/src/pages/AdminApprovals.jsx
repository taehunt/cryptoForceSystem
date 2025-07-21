import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminApprovals = () => {
    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState('');

    const fetchPendingRequests = async () => {
        try {
            const res = await axios.get('/api/admin/payment-requests');
            setRequests(res.data || []);
        } catch (err) {
            console.error('결제 요청 목록 불러오기 실패:', err);
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await axios.post(`/api/admin/payment-requests/${id}/approve`);
            if (res.data.success) {
                setStatus('승인 성공');
                fetchPendingRequests();
            } else {
                setStatus('승인 실패: ' + (res.data.error || ''));
            }
        } catch (err) {
            console.error(err);
            setStatus('요청 중 오류 발생');
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">결제 요청 승인</h1>
            {status && <p className="mb-4 text-sm text-gray-700">{status}</p>}
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <p>대기 중인 결제 요청이 없습니다.</p>
                ) : (
                    requests.map((req) => (
                        <div
                            key={req._id}
                            className="border rounded p-4 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-semibold">
                                    가맹점: {req.merchant?.name || '알 수 없음'}
                                </p>
                                <p>금액: {req.amount} USDT</p>
                                <p>요청자: {req.user?.email}</p>
                                {req.message && <p>메시지: {req.message}</p>}
                            </div>
                            <button
                                onClick={() => handleApprove(req._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                승인
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminApprovals;
