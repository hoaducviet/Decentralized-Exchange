'use client'
import { useWeb3 } from "@/hooks/useWeb3";
import { formatEther } from "ethers";
import { useEffect, useState } from "react";

export const useGasSwapToken = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}

export const useGasAddLiquidity = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}

export const useGasRemoveLiquidity = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}

export const useGasSwapLimit = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}


export const useGasTransferToken = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}


export const useGasBuyNFT = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}


export const useGasSellNFT = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}

export const useGasTransferNFT = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}


export const useGasWithdrawNFT = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}

export const useGasWithdrawUSD = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}


export const useGasGetPhysicalNFT = () => {
    const web3 = useWeb3()
    const [gasEstimate, setGasEstimate] = useState<number>(0)
    const jsonProvider = web3?.jsonProvider

    useEffect(() => {
        const getGasEstimate = async () => {
            if (jsonProvider) {
                const feeData = await jsonProvider.getFeeData()
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice
                setGasEstimate(parseFloat(formatEther(gasPrice || 0)) * 300000)
            }
        }
        getGasEstimate()
    }, [jsonProvider])
    return gasEstimate
}