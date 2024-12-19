'use client'
import { useEffect, useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { useWeb3 } from "@/hooks/useWeb3"
import { useToast } from '@/hooks/useToast'
import { useAddLiquidityTransactionMutation, useUpdateLiquidityTransactionMutation } from "@/redux/features/api/apiSlice"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeItem from "@/components/exchange/TradeItem"
import { addLiquidityPool } from "@/services/liquiditypool/addLiquidityPool"
import { HeightIcon } from "@radix-ui/react-icons"
import { TokenBalancesType, Token, ReservePool } from "@/lib/type"
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet"
import LiquidityTransactionWaiting from "@/components/transaction/LiquidityTransactionWaiting"
import { useGasAddLiquidity } from "@/hooks/useGas"

interface Props {
    tokens: Token[],
    tokenBalances: TokenBalancesType[] | undefined,
    reserves: ReservePool[],
}
 
export default function PoolBoxUSD({ tokens, tokenBalances, reserves }: Props) {
    const { isConnected, address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { showError } = useToast()
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<ReservePool | undefined>(undefined);
    const [addLiquidityTransaction] = useAddLiquidityTransactionMutation()
    const [updateLiquidityTransaction, { data: updateTransaction, isSuccess: updateSuccess }] = useUpdateLiquidityTransactionMutation()
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [balance1, setBalance1] = useState<string>("0")
    const [balance2, setBalance2] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const newTokens = tokens.filter(token => ['ETH', 'USDT'].includes(token.symbol))
    const usdToken = tokens.find(token => token.symbol === "USD")
    const optionTokens = tokens.filter(token => token.symbol !== tokenOne?.symbol && token.symbol !== tokenTwo?.symbol)
    const gas = useGasAddLiquidity().toString()

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
        setTokenOne(two)
        setTokenTwo(one)
        setAmount1(amount2)
    }

    // Set current pool và reserve của 2 tokens
    useEffect(() => {
        if (tokenOne && tokenTwo) {
            const currentPool = reserves.find(pool => [`${tokenOne.symbol}/${tokenTwo.symbol}`, `${tokenTwo.symbol}/${tokenOne.symbol}`].includes(pool.info.name))
            if (currentPool?.info.token1.address === tokenOne.address) {
                setReserve1(parseFloat(currentPool.reserve1))
                setReserve2(parseFloat(currentPool.reserve2))
            } else {
                setReserve1(parseFloat(currentPool?.reserve2 || '0'))
                setReserve2(parseFloat(currentPool?.reserve1 || '0'))
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
            setIsChecked(false)
        } else {
            const value = parseFloat(amount1) * reserve2 / reserve1
            setAmount2(value.toString())
            setIsChecked(parseFloat(balance1) > parseFloat(amount1) && parseFloat(balance2) > value)
        }
    }, [amount1, balance1, balance2, reserve1, reserve2])

    useEffect(() => {
        if (updateTransaction && updateSuccess) {
            setAmount1("")
            setAmount2("")
        }
    }, [updateSuccess, updateTransaction])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && !!tokenTwo && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            const { data: newTransaction } = await addLiquidityTransaction({
                type: 'Add Liquidity',
                wallet: address,
                pool_id: currentPool.info._id,
                token1_id: currentPool.info.token1._id,
                token2_id: currentPool.info.token2._id,
            })
            try {
                const receipt = await addLiquidityPool({ provider, signer, address, pool: currentPool, tokenOne, amount1, amount2 })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateLiquidityTransaction({
                        _id: newTransaction._id,
                        receipt_hash: confirmedReceipt.hash,
                    })
                } else {
                    if (newTransaction?._id) {
                        updateLiquidityTransaction({
                            _id: newTransaction._id,
                            receipt_hash: ""
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateLiquidityTransaction({
                        _id: newTransaction._id,
                        receipt_hash: ""
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, currentPool, tokenOne, tokenTwo, amount1, amount2])

    const handleToast = () => {
        if (!isChecked) {
            showError("Invalid USD quantity!")
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
            {isConnected ?
                <div onClick={handleToast} className='flex w-full'>
                    {isChecked ?
                        <LiquidityTransactionWaiting type="Add Liquidity" handleSend={handleSend} tokenOne={tokenOne} tokenTwo={tokenTwo} address={address} pool={currentPool} amount1={amount1} amount2={amount2} gasEth={gas}>
                            <div className="flex w-full">
                                <SubmitItem name="Send" isChecked={isChecked} />
                            </div>
                        </LiquidityTransactionWaiting>
                        :
                        <div className="flex w-full">
                            <SubmitItem name="Send" isChecked={isChecked} />
                        </div>
                    }
                </div>
                :
                <PopoverConnectWallet>
                    <div className='flex w-full'>
                        <SubmitItem name="Connect Wallet" />
                    </div>
                </PopoverConnectWallet>
            }
        </div>
    )
}