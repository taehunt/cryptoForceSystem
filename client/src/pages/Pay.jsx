import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Web3 from 'web3';

const ERC20_ABI = [
    {
        constant: false,
        inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
    }
];
/* test */
const Pay = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [merchants, setMerchants] = useState([]);
    const [selectedMerchantId, setSelectedMerchantId] = useState('');
    const [amount, setAmount] = useState('');
    const [connectedAddress, setConnectedAddress] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // fallback: .env 에서 기본 커스터디/USDT 주소 읽기 (없으면 서버에서 보낸 depositAddress 사용)
    const FALLBACK_TOKEN = process.env.REACT_APP_USDT_TOKEN_ADDRESS || '';

    useEffect(() => {
        if (user === false) navigate('/login');
        fetchMerchants();
    }, [user, navigate]);

    const fetchMerchants = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/merchants`, { credentials: 'include' });
            const data = await res.json();
            setMerchants(data || []);
        } catch (err) {
            console.error('상점 불러오기 실패:', err);
        }
    };

    const handleConnectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask 설치 필요');
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedAddress(accounts[0]);
        } catch (err) {
            console.error('지갑 연결 실패:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        setLoading(true);

        if (!selectedMerchantId || !amount || !connectedAddress) {
            setStatusMessage('❌ 모든 항목을 입력해주세요.');
            setLoading(false);
            return;
        }

        try {
            // ① 서버에 결제요청 생성 → id/입금주소/decimals 응답
            const reqRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payments/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    merchantId: selectedMerchantId,
                    amount,          // 문자열 권장
                    chain: 'EVM',
                    token: 'USDT'
                })
            });
            const reqData = await reqRes.json();
            if (!reqRes.ok || !reqData?.ok) throw new Error(reqData.message || '결제 요청 실패');

            const { id: paymentId, depositAddress, decimals = 6 } = reqData.data;

            // 상점의 USDT 토큰 주소(없으면 env fallback)
            const merchant = merchants.find(m => m.id === selectedMerchantId) || {};
            const tokenAddress = merchant.tokenAddress || FALLBACK_TOKEN;
            if (!tokenAddress) throw new Error('USDT 토큰 주소가 설정되지 않았습니다.');

            // ② 메타마스크로 USDT 전송 (ERC20 transfer)
            if (!window.ethereum) throw new Error('MetaMask 필요');
            const web3 = new Web3(window.ethereum);

            const usdtAmount = web3.utils.toWei(String(amount), 'mwei'); // USDT 6 decimals
            const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
            const txReceipt = await contract.methods
                .transfer(depositAddress, usdtAmount)
                .send({ from: connectedAddress });

            const txHash = txReceipt?.transactionHash;
            if (!txHash) throw new Error('txHash 없음');

            // ③ txHash 제출
            const subRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payments/${paymentId}/submit-tx`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ clientTxHash: txHash })
            });
            const subData = await subRes.json();
            if (!subRes.ok || subData?.ok === false) throw new Error(subData.message || 'tx 제출 실패');

            setStatusMessage('✅ 결제 요청이 성공적으로 전송되었습니다.');
            setAmount('');
            setSelectedMerchantId('');
        } catch (err) {
            console.error(err);
            setStatusMessage(err.message || '❌ 결제 요청 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">💳 Web3 결제 요청</h2>
            <p className="text-center text-gray-600 mb-8">
                상점과 금액을 입력하고, MetaMask로 연결된 지갑에서 <b>USDT 전송</b> 후 제출하세요.
            </p>

            {!connectedAddress ? (
                <button
                    onClick={handleConnectWallet}
                    className="w-full bg-yellow-500 text-white font-semibold py-3 rounded hover:bg-yellow-600 transition"
                >
                    🦊 MetaMask 지갑 연결
                </button>
            ) : (
                <div className="bg-gray-100 border border-gray-300 p-3 rounded mb-4 text-sm text-gray-800 font-mono">
                    ✅ 연결된 지갑: {connectedAddress}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상점 선택</label>
                    <select
                        value={selectedMerchantId}
                        onChange={(e) => setSelectedMerchantId(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">상점을 선택하세요</option>
                        {merchants.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">금액 (USDT)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        placeholder="예: 10.00"
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-white rounded transition font-semibold ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {loading ? '전송 중...' : '결제 요청'}
                </button>

                {statusMessage && (
                    <p
                        className={`text-sm text-center font-medium ${
                            statusMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {statusMessage}
                    </p>
                )}
            </form>
        </div>
    );
};

export default Pay;
