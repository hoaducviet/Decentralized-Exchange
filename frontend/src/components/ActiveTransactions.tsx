'use client'
import { useAccount } from "wagmi"
import { useGetActivesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import NFTCardAcitve from "@/components/NFTCardActive"
import TokenCardAcitve from "@/components/TokenCardActive"
import LiquidityCardAcitve from "@/components/LiquidityCardActive"
import USDCardAcitve from "@/components/USDCardActive"
import OrderCardAcitve from "@/components/OrderCardActive"
import { NFTActiveTransaction, TokenActiveTransaction, LiquidityActiveTransaction, USDActiveTransaction, OrderActiveTransaction, } from "@/lib/type"
import OrderLimitTransaction from "@/components/transaction/OrderLimitTransaction"
import TokenTransactionOverview from "@/components/transaction/TokenTransactionOverview"
import LiquidityTransactionOverview from "@/components/transaction/LiquidityTransactionOverview"
import NFTTransactionOverview from "@/components/transaction/NFTTransactionOverview"
import PaymentTransactionOverview from "@/components/transaction/PaymentTransactionOverview"

export default function ActiveTransactions() {
    const { address } = useAccount()
    const { data: newtransactions, isFetching } = useGetActivesQuery(address ?? skipToken)
    const transactions = newtransactions?.filter(item => !(item.type == 'Order Limit' && item.status !== 'Pending')).slice(0, 100)

    return (
        <div>
            {!isFetching && transactions && (
                <>
                    {transactions.length > 0 ? <>{transactions.map((item, index) => {
                        if (item.type.includes("Pay")) {
                            return (
                                <div key={index} className="flex flex-col">
                                    <PaymentTransactionOverview transaction={item as USDActiveTransaction}>
                                        <div className="flex flex-col">
                                            <USDCardAcitve transaction={item as USDActiveTransaction} />
                                        </div>
                                    </PaymentTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("NFT")) {
                            return (
                                <div key={index} className="flex flex-col">
                                    <NFTTransactionOverview transaction={item as NFTActiveTransaction}>
                                        <div className="flex flex-col">
                                            <NFTCardAcitve transaction={item as NFTActiveTransaction} />
                                        </div>
                                    </NFTTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("Liquidity")) {
                            return (
                                <div key={index} className="flex flex-col">
                                    <LiquidityTransactionOverview transaction={item as LiquidityActiveTransaction}>
                                        <div className="flex flex-col">
                                            <LiquidityCardAcitve transaction={item as LiquidityActiveTransaction} />
                                        </div>
                                    </LiquidityTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("Token")) {
                            return (
                                <div key={index} className="flex flex-col">
                                    <TokenTransactionOverview transaction={item as TokenActiveTransaction}>
                                        <div className="flex flex-col">
                                            <TokenCardAcitve transaction={item as TokenActiveTransaction} />
                                        </div>
                                    </TokenTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("Order")) {
                            return (
                                <div key={index} className="flex flex-col" >
                                    <OrderLimitTransaction transaction={item as OrderActiveTransaction}>
                                        <div className="flex flex-col" >
                                            <OrderCardAcitve transaction={item as OrderActiveTransaction} />
                                        </div>
                                    </OrderLimitTransaction>
                                </div>
                            )
                        }
                        return (
                            <div key={index} className="flex flex-col" >
                                <TokenCardAcitve transaction={item as TokenActiveTransaction} />
                            </div>
                        )
                    })}</> : <div className="flex flex-row justify-center items-start w-full my-[2vw]"> No actives</div>}
                </>
            )
            }
        </div >
    )
}