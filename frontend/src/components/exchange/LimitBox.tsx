'use client'
import { useEffect, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useAccount } from "wagmi"
import { useWeb3 } from "@/hooks/useWeb3"
import { useBalances } from '@/hooks/useBalances'
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import TimeItem from "@/components/exchange/TimeItem"
import TradeItem from "@/components/exchange/TradeItem"
import LimitItem from "@/components/exchange/LimitItem"
import { resetBalances } from "@/redux/features/balances/balancesSlice"
import { swapLiquidityPool } from "@/services/liquiditypool/swapLiquidityPool"
import { getReservePairPool } from "@/utils/getReservePairPool"
import { getLiquidityPool } from "@/utils/getLiquidityPool"
import { HeightIcon } from "@radix-ui/react-icons"
import { LiquidBalancesType, TokenBalancesType } from '@/lib/type';

export default function LimitBox() {
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
    const [price, setPrice] = useState<string>("")
    const tokensbalances = tokenBalances.filter(tokenBalance => tokenBalance.balance?.value !== 0 && tokenBalance.info.symbol !== 'USD')

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(tokensbalances[0])
            setTokenTwo(tokensbalances[1])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    const balances = isLoaded ? tokensbalances.filter(tokenBalance => tokenBalance.info.address !== tokenOne?.info.address && tokenBalance.info.address !== tokenTwo?.info.address) : [];

    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        setTokenOne(two)
        setTokenTwo(one)
        setAmount1(amount2)
    }

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

    useEffect(() => {
        if (reserve1 > 0 && reserve2 > 0) {
            const value = (reserve2 / reserve1).toString();
            setPrice(value.slice(0, value.indexOf('.') + 7));
        } else {
            setPrice("");
        }
    }, [reserve1, reserve2])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && parseFloat(amount1) > 0) {
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
    }, [provider, signer, currentPool, address, tokenOne, amount1, dispatch])

    return (
        <div className="flex flex-col w-full h-full">
            <LimitItem tokenOne={tokenOne} tokenTwo={tokenTwo} price={price} tokenBalances={balances} setTokenOne={setTokenOne} setTokenTwo={setTokenTwo} />
            <div className="relative flex flex-col w-full h-full">
                <TradeItem title="Buy" tokenBalance={tokenOne} tokenBalances={balances} setToken={setTokenOne} amount={amount1} setAmount={setAmount1} />
                <TradeItem title="Sell" tokenBalance={tokenTwo} tokenBalances={balances} setToken={setTokenTwo} amount={amount2} setAmount={setAmount2} isDisabled />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                    <Button onClick={handleSwitchTokens} variant="secondary" className="w-[full] h-full">
                        <HeightIcon className="w-full h-full" />
                    </Button>
                </div>
            </div>
            <TimeItem />
            <div onClick={handleSend}>
                <SubmitItem name="Confirm" />
            </div>
        </div>
    )
}