'use client'
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useWeb3 } from "@/hooks/useWeb3"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeItem from "@/components/exchange/TradeItem"
import { addLiquidityPool } from "@/services/liquiditypool/addLiquidityPool"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { HeightIcon } from "@radix-ui/react-icons"
import { TokenBalancesType, Token, ReservePool } from "@/lib/type"

interface Props {
    tokens: Token[],
    tokenBalances: TokenBalancesType[] | undefined,
    reservePools: ReservePool[],
}

export default function PoolBoxUSD({ tokens, tokenBalances, reservePools }: Props) {
    const { address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<ReservePool | undefined>(undefined);
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [balance1, setBalance1] = useState<string>("0")
    const [balance2, setBalance2] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const newTokens = tokens.filter(token => ['ETH', 'USDT'].includes(token.symbol))
    const usdToken = tokens.find(token => token.symbol === "USD")
    const optionTokens = tokens.filter(token => token.symbol !== tokenOne?.symbol && token.symbol !== tokenTwo?.symbol)

    //Set mặc định giá trị ban đầu cho 2 token
    useEffect(() => {
        setTokenOne(usdToken)
        setTokenTwo(newTokens[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Switch 2 token
    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        const balanceOne = balance1
        const balanceTwo = balance2
        setTokenOne(two)
        setTokenTwo(one)
        setAmount1(amount2)
        setBalance1(balanceTwo)
        setBalance2(balanceOne)
    }

    // Set current pool và reserve của 2 tokens
    useEffect(() => {
        if (tokenOne && tokenTwo) {
            const currentPool = reservePools.find(pool => [`${tokenOne.symbol}/${tokenTwo.symbol}`, `${tokenTwo.symbol}/${tokenOne.symbol}`].includes(pool.info.name))
            if (currentPool?.info.addressToken1 === tokenOne.address) {
                setReserve1(Number(currentPool.reserve1))
                setReserve2(Number(currentPool.reserve2))
            } else {
                setReserve1(Number(currentPool?.reserve2))
                setReserve2(Number(currentPool?.reserve1))
            }
            setCurrentPool(currentPool)
            setBalance1(tokenBalances?.find(item => item.info.symbol === tokenOne.symbol)?.balance?.formatted || "0")
            setBalance2(tokenBalances?.find(item => item.info.symbol === tokenTwo.symbol)?.balance?.formatted || "0")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, tokenBalances])

    // Tính đầu ra cho amount2 of tokens2
    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
        } else {
            const value = parseFloat(amount1) * reserve2 / reserve1
            setAmount2(value.toString())
        }
    }, [amount1, reserve1, reserve2])

    const handleSend = async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            try {
                const receipt = await addLiquidityPool({ provider, signer, address, pool: currentPool, tokenOne, amount1, amount2 })
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
    }
    return (
        <div className="flex flex-col w-full h-full">
            <div className="relative flex flex-col w-full h-full">
                <TradeItem title="Amount" token={tokenOne} tokens={optionTokens} setToken={setTokenOne} amount={amount1} setAmount={setAmount1} balance={balance1} />
                <TradeItem title="Amount" token={tokenTwo} tokens={optionTokens} setToken={setTokenTwo} amount={amount2} setAmount={setAmount2} balance={balance2} isDisabled />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                    <Button onClick={handleSwitchTokens} variant="secondary" className="w-[full] h-full">
                        <HeightIcon className="w-full h-full" />
                    </Button>
                </div>
            </div>
            <div >
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div>
                            <SubmitItem name="Send" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSend} >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}