import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const WalletManager = () => {
    const { user, reloadUser } = useAuth();

    const [connectedAddress, setConnectedAddress] = useState('');
    const [walletMessage, setWalletMessage] = useState('');

    const [wallet, setWallet] = useState({
        metamask: user?.wallet?.metamask || '',
        upbit: user?.wallet?.upbit || '',
        binance: user?.wallet?.binance || '',
    });

    const [defaultWallet, setDefaultWallet] = useState(user?.defaultWalletType || '');
    const [signature, setSignature] = useState('');

    useEffect(() => {
        if (!window.ethereum) return;

        const autoConnect = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setConnectedAddress(accounts[0]);
                    setWallet(prev => ({ ...prev, metamask: accounts[0] }));
                }
            } catch (err) {
                console.error('MetaMask 자동 연결 실패:', err);
            }
        };

        autoConnect();
    }, []);

    const handleConnectMetaMask = async () => {
        if (!window.ethereum) {
            alert('🦊 MetaMask 설치 필요');
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedAddress(accounts[0]);
            setWallet(prev => ({ ...prev, metamask: accounts[0] }));
            setWalletMessage('✅ MetaMask 주소가 등록되었습니다.');
        } catch (err) {
            console.error(err);
            setWalletMessage('❌ MetaMask 연결 실패');
        }
    };

    const handleSign = async () => {
        if (!connectedAddress) return;
        try {
            const msg = 'CryptoForce 서명 요청';
            const signed = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, connectedAddress],
            });
            setSignature(signed);
        } catch (err) {
            console.error('서명 실패:', err);
        }
    };

    const handleSave = async () => {
        setWalletMessage('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/wallet`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    wallet,
                    defaultWalletType: defaultWallet,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setWalletMessage('✅ 지갑 정보가 저장되었습니다.');
            if (reloadUser) reloadUser();
        } catch (err) {
            setWalletMessage(err.message || '❌ 저장 실패');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWallet(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">🦊 MetaMask</h3>
                {connectedAddress ? (
                    <p className="text-sm">✅ 연결됨: <span className="font-mono">{connectedAddress}</span></p>
                ) : (
                    <button
                        onClick={handleConnectMetaMask}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        MetaMask 연결
                    </button>
                )}
                <div className="mt-2">
                    <button
                        onClick={handleSign}
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                        지갑 서명 요청
                    </button>
                    {signature && (
                        <div className="mt-2 text-xs break-all text-gray-600">
                            서명 결과: <span className="font-mono">{signature}</span>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">🏦 업비트 / 바이낸스 지갑 주소 입력</h3>
                <div className="space-y-2">
                    <input
                        name="upbit"
                        placeholder="업비트 지갑 주소"
                        value={wallet.upbit}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        name="binance"
                        placeholder="바이낸스 지갑 주소"
                        value={wallet.binance}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">⭐ 기본 결제 지갑 선택</h3>
                <div className="space-y-2">
                    <label className="block">
                        <input
                            type="radio"
                            value="metamask"
                            checked={defaultWallet === 'metamask'}
                            onChange={() => setDefaultWallet('metamask')}
                            className="mr-2"
                        />
                        MetaMask
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="upbit"
                            checked={defaultWallet === 'upbit'}
                            onChange={() => setDefaultWallet('upbit')}
                            className="mr-2"
                        />
                        업비트
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="binance"
                            checked={defaultWallet === 'binance'}
                            onChange={() => setDefaultWallet('binance')}
                            className="mr-2"
                        />
                        바이낸스
                    </label>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                지갑 정보 저장
            </button>

            {walletMessage && (
                <p className={`text-sm mt-2 ${walletMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {walletMessage}
                </p>
            )}
        </div>
    );
};

export default WalletManager;
