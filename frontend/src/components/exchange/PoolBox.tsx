'use client'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useAccount } from "wagmi"
import { useWeb3 } from "@/hooks/useWeb3"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeItem from "@/components/exchange/TradeItem"
import { addLiquidityPool } from "@/services/liquiditypool/addLiquidityPool"
import { getReservePairPool } from "@/utils/getReservePairPool"
import { getLiquidityPool } from "@/utils/getLiquidityPool"
import { resetBalances } from "@/redux/features/balances/balancesSlice"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { HeightIcon } from "@radix-ui/react-icons"
import { TokenBalancesType, LiquidBalancesType } from "@/lib/type"

interface Props {
    tokenBalances: TokenBalancesType[],
    liquidBalances: LiquidBalancesType[],
    isLoaded: boolean,
}

export default function PoolBox({ tokenBalances, liquidBalances, isLoaded }: Props) {
    const { address } = useAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const [tokenOne, setTokenOne] = useState<TokenBalancesType | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<TokenBalancesType | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<LiquidBalancesType | undefined>(undefined);
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")

    //Set mặc định giá trị ban đầu cho 2 token
    useEffect(() => {
        if (isLoaded) {
            setTokenOne(tokenBalances[0])
            setTokenTwo(tokenBalances[2])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    // Lọc lại danh sách tokens, loại trừ tokenOne và tokenTwo
    const balances = isLoaded ? tokenBalances.filter(tokenBalance => tokenBalance?.info.address !== tokenOne?.info.address && tokenBalance?.info.address !== tokenTwo?.info.address) : [];

    // Switch 2 token
    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        setTokenOne(two)
        setTokenTwo(one)
        setAmount1(amount2)
    }

    // Set current pool và reserve của 2 tokens
    useEffect(() => {
        const getResever = async () => {
            if (provider && !!tokenOne && !!tokenTwo && liquidBalances.length > 0) {
                const liquidityPool = getLiquidityPool({ liquidBalances, tokenOne, tokenTwo })
                if (liquidityPool) {
                    const { reserve1, reserve2 } = await getReservePairPool({ provider, pool: liquidityPool, tokenOne })
                    setCurrentPool(liquidityPool)
                    setReserve1(reserve1)
                    setReserve2(reserve2)
                }
            }
        }
        getResever()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, provider])

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
                    dispatch(resetBalances())
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
                <TradeItem title="Amount" tokenBalance={tokenOne} tokenBalances={balances} setToken={setTokenOne} amount={amount1} setAmount={setAmount1} />
                <TradeItem title="Amount" tokenBalance={tokenTwo} tokenBalances={balances} setToken={setTokenTwo} amount={amount2} setAmount={setAmount2} isDisabled />
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