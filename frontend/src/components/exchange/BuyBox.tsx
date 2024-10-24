'use client'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from "react-redux"
import { useAccount } from 'wagmi'
import { useWeb3 } from "@/hooks/useWeb3"
import { useBalances } from '@/hooks/useBalances'
import { getLiquidityPool } from "@/utils/getLiquidityPool"
import { getReservePairPool } from "@/utils/getReservePairPool"
import { swapLiquidityPool } from "@/services/liquiditypool/swapLiquidityPool"
import { resetBalances } from "@/redux/features/balances/balancesSlice"
import SubmitItem from "@/components/exchange/SubmitItem"
import BuyItem from "@/components/exchange/BuyItem"
import { TokenBalancesType, LiquidBalancesType } from "@/lib/type"


export default function BuyBox() {
    const { address } = useAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { tokenBalances, liquidBalances, isLoaded } = useBalances();
    const [tokenOne, setTokenOne] = useState<TokenBalancesType | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<TokenBalancesType | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<LiquidBalancesType | undefined>(undefined);
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const tokensbalances = tokenBalances.filter(tokenBalance => tokenBalance.info.symbol === 'ETH' || tokenBalance.info.symbol === 'USDT')
    const usdBalances = tokenBalances.find(tokenBalance => tokenBalance.info.symbol === "USD")
    const balances = isLoaded ? tokensbalances.filter(tokenBalance => tokenBalance.info.address !== tokenTwo?.info.address) : [];

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(usdBalances)
            setTokenTwo(tokensbalances[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    useEffect(() => {
        const getResever = async () => {
            if (provider && !!tokenOne && !!tokenTwo && liquidBalances.length > 0) {
                const liquidityPool = getLiquidityPool({ liquidBalances, tokenOne, tokenTwo })
                if (liquidityPool) {
                    const { reserve1, reserve2 } = await getReservePairPool({ provider, pool: liquidityPool, tokenOne })
                    console.log(reserve1, reserve2)
                    setCurrentPool(liquidityPool)
                    setReserve1(reserve1)
                    setReserve2(reserve2)
                }
            }
        }
        getResever()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, provider])

    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
        } else {
            const value = parseFloat(amount1)
            const amountReceiver = value * reserve2 / (reserve1 + value)
            setAmount2(amountReceiver.toString())
        }
    }, [amount1, reserve1, reserve2])


    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && !!tokenTwo && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            try {
                const receipt = await swapLiquidityPool({ provider, signer, address, pool: currentPool, tokenOne, amount: amount1 })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1) {
                    dispatch(resetBalances())
                    setAmount1("")
                    setAmount2("")
                } else {
                    console.error("Transaction error:", confirmedReceipt);
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
            }
        }
    }, [provider, signer, currentPool, address, tokenOne, amount1, tokenTwo, amount2, dispatch])

    return (
        <div className="flex flex-col justify-center items-center">
            <BuyItem tokenBalance={tokenTwo} tokenBalances={balances} setToken={setTokenTwo} setAmount={setAmount1} amount1={amount1} amount2={amount2} />
            <div onClick={handleSend} className='flex w-full'>
                <SubmitItem name="Buy" />
            </div>
        </div>
    )
}