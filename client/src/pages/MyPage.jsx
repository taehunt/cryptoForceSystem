import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WalletManager from '../components/WalletManager';
import PaymentHistory from '../components/PaymentHistory';
import SecuritySettings from '../components/SecuritySettings';

const TABS = ['내 정보', '지갑 관리', '결제 내역', '보안 설정'];

const MyPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('내 정보');

    useEffect(() => {
        if (user === false) navigate('/login');
    }, [user, navigate]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
            <h2 className="text-2xl font-bold mb-4">마이페이지</h2>

            {/* ✅ 결제 요청 버튼 */}
            <div className="mb-4">
                <button
                    onClick={() => navigate('/pay')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    💳 결제 요청하기
                </button>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex border-b mb-6 space-x-4">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-4 border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 탭 내용 */}
            {activeTab === '내 정보' && (
                <div className="space-y-2">
                    <p><span className="font-semibold">아이디:</span> {user?.id}</p>
                    <p><span className="font-semibold">이메일:</span> {user?.email}</p>
                    <p><span className="font-semibold">기본 지갑:</span> {user?.defaultWalletType || '등록되지 않음'}</p>
                </div>
            )}
            {activeTab === '지갑 관리' && <WalletManager />}
            {activeTab === '결제 내역' && <PaymentHistory />}
            {activeTab === '보안 설정' && <SecuritySettings />}
        </div>
    );
};

export default MyPage;
