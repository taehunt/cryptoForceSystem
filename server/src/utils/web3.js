import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.SERVER_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const USDT_ABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
    }
];

export const sendToken = async ({ privateKey, tokenAddress, to, amount }) => {
    const web3 = new Web3(process.env.WEB3_RPC_URL);
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