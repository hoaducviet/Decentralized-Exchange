'use client'
import { useEffect, useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { useWeb3 } from "@/hooks/useWeb3"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import TimeItem from "@/components/exchange/TimeItem"
import TradeItem from "@/components/exchange/TradeItem"
import LimitItem from "@/components/exchange/LimitItem"
import { swapLimitPool } from "@/services/liquiditypool/swapLimitPool"
import { HeightIcon } from "@radix-ui/react-icons"
import { ReservePool, Token, Address } from "@/lib/type"
import { useGetTokenBalancesQuery, useGetTokensQuery, useGetReservePoolQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"

const addressContract: Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address

export default function LimitBox() {
    const { address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { data: allTokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: reservePools } = useGetReservePoolQuery()
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<ReservePool | undefined>(undefined);
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [balance1, setBalance1] = useState<string>("0")
    const [balance2, setBalance2] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const [percent, setPercent] = useState<string>("1.0")
    const tokens = allTokens?.filter(token => token.symbol !== 'USD')
    const newTokens = tokens?.filter(token => token?.address !== tokenOne?.address && token?.address !== tokenTwo?.address);

    useEffect(() => {
        if (!isFetchingToken && tokens) {
            setTokenOne(tokens[0])
            setTokenTwo(tokens[1])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetchingToken])

    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        setTokenOne(two)
        setTokenTwo(one)
        setAmount1(amount2)
    }

    useEffect(() => {
        if (tokenOne && tokenTwo && reservePools) {
            const currentPool = reservePools.find(pool => [`${tokenOne.symbol}/${tokenTwo.symbol}`, `${tokenTwo.symbol}/${tokenOne.symbol}`].includes(pool.info.name))
            if (currentPool?.info.token1.address === tokenOne.address) {
                setReserve1(Number(currentPool.reserve1))
                setReserve2(Number(currentPool.reserve2))
                console.log(currentPool.reserve1, currentPool.reserve2)
            } else {
                setReserve1(Number(currentPool?.reserve2))
                setReserve2(Number(currentPool?.reserve1))
                console.log(currentPool?.reserve2, currentPool?.reserve1)
            }
            setCurrentPool(currentPool)
            setBalance1(tokenBalances?.find(item => item.info.symbol === tokenOne.symbol)?.balance?.formatted || "0")
            setBalance2(tokenBalances?.find(item => item.info.symbol === tokenTwo.symbol)?.balance?.formatted || "0")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, tokenBalances, reservePools])

    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
        } else {
            const value = parseFloat(amount1)
            const amountReceiver = value * reserve2 * parseFloat(percent) / (reserve1 + value)
            setAmount2(amountReceiver.toString())
        }
    }, [amount1, reserve1, reserve2, percent])

    useEffect(() => {
        if (reserve1 > 0 && reserve2 > 0) {
            const value = ((reserve2 / reserve1) * parseFloat(percent)).toString();
            setPrice(value.slice(0, value.indexOf('.') + 7));
        } else {
            setPrice("");
        }
    }, [reserve1, reserve2, percent])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && parseFloat(amount1) > 0) {
            try {
                const receipt = await swapLimitPool({ provider, signer, address, addressContract, pool: currentPool, tokenOne, amount: amount1, price })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1) {
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
    }, [provider, signer, currentPool, address, tokenOne, amount1, price])

    return (
        <>
            {!isFetchingToken && newTokens &&
                <div className="flex flex-col w-full h-full">
                    <LimitItem tokenOne={tokenOne} tokenTwo={tokenTwo} price={price} tokens={newTokens} setTokenOne={setTokenOne} setTokenTwo={setTokenTwo} setPercent={setPercent} handleSwitchTokens={handleSwitchTokens}/>
                    <div className="relative flex flex-col w-full h-full">
                        <TradeItem title="From" token={tokenOne} tokens={newTokens} setToken={setTokenOne} amount={amount1} setAmount={setAmount1} balance={balance1} />
                        <TradeItem title="To" token={tokenTwo} tokens={newTokens} setToken={setTokenTwo} amount={amount2} setAmount={setAmount2} balance={balance2} isDisabled />
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
            }
        </>
    )
}