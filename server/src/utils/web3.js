import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

// NOTE
// 이 모듈은 "커스터디 지갑이 보유한 자산"을 외부로 보낼 때만 사용.
// 결제 승인(approvePayment) 시 사용자 지갑으로 송금하는 동작은 금지됨(문서 정책).

// 기본 web3 인스턴스
export const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_RPC_URL));

// 서버 지갑을 사용할 경우에만 호출
export const getServerAccount = () => {
    const key = process.env.SERVER_PRIVATE_KEY;
    if (!key || !key.startsWith('0x')) {
        throw new Error('❌ SERVER_PRIVATE_KEY가 설정되지 않았거나 잘못된 형식입니다.');
    }
    const account = web3.eth.accounts.privateKeyToAccount(key);
    web3.eth.accounts.wallet.add(account);
    return account;
};

// 최소한의 USDT 전송용 ABI (ERC20 표준의 transfer 메서드만 사용)
const USDT_ABI = [
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
    }
];

// 특정 프라이빗키로 USDT 전송 (MetaMask 없이 서버에서 트랜잭션 발생 시 사용)
export const sendToken = async ({ privateKey, tokenAddress, to, amount }) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_RPC_URL));
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const contract = new web3.eth.Contract(USDT_ABI, tokenAddress);
    const tx = contract.methods.transfer(to, amount);

    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const receipt = await tx.send({
        from: account.address,
        gas,
        gasPrice,
    });

    return receipt.transactionHash;
};