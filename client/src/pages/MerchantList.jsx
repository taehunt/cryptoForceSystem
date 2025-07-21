// 경로: client/src/pages/MerchantList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MerchantList = () => {
    const [merchants, setMerchants] = useState([]);
    const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/merchants`, {
                    withCredentials: true
                });
                setMerchants(res.data);
            } catch (err) {
                console.error('가맹점 불러오기 실패:', err);
            }
        };

        fetchMerchants();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">가맹점 목록</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {merchants.map((merchant) => (
                    <div key={merchant._id} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">{merchant.name}</h2>
                        <p className="text-sm text-gray-600">{merchant.description}</p>
                        <p className="text-sm mt-2">주소: {merchant.walletAddress}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MerchantList;
