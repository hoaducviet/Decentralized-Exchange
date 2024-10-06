'use client'

import { useAccount, useConnect } from 'wagmi';

import MyContractABI from '@/artifacts/Lock.json';
import Web3 from 'web3'

const contractAddress = process.env.CONTRACT_ADDRESS_LOCK;

export default function Wallet() {
    const { connectors } = useConnect();
    const { isConnected, address } = useAccount();

    const getContractData = async () => {
        if (!isConnected) return;

        // Tạo provider từ MetaMask
        const web3 = new Web3(Web3.givenProvider)

       

        const lockContract = new web3.eth.Contract(MyContractABI.abi, contractAddress)

        console.log(lockContract.methods)

        try {
            // const data = await lockContract.withdraw(); // Gọi hàm từ contract
            console.log('Dữ liệu từ contract:');
        } catch (error) {
            console.error('Lỗi khi gọi contract:', error);
        }
    };

    return (
        <div className='bg-red-300'>
            {isConnected ? (
                <div>
                    <p>Connected as: {address}</p>
                    <button onClick={getContractData}>Get Contract Data</button>
                </div>
            ) : (
                <div>
                    {connectors.map((connector) => (
                        <button key={connector.id}>
                            Connect with {connector.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}



