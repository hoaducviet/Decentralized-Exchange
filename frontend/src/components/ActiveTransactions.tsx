'use client'
import { useAccount } from "wagmi"
import { useGetActivesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import NFTCardAcitve from "@/components/NFTCardActive"
import TokenCardAcitve from "@/components/TokenCardActive"
import LiquidityCardAcitve from "@/components/LiquidityCardActive"
import USDCardAcitve from "@/components/USDCardActive"
import OrderCardAcitve from "@/components/OrderCardActive"
import { ActivesType, NFTActiveTransaction, TokenActiveTransaction, LiquidityActiveTransaction, USDActiveTransaction, OrderActiveTransaction, } from "@/lib/type"
import OrderLimitTransaction from "@/components/transaction/OrderLimitTransaction"
import TokenTransactionOverview from "@/components/transaction/TokenTransactionOverview"
import LiquidityTransactionOverview from "@/components/transaction/LiquidityTransactionOverview"
import NFTTransactionOverview from "@/components/transaction/NFTTransactionOverview"
import PaymentTransactionOverview from "@/components/transaction/PaymentTransactionOverview"

export default function ActiveTransactions() {
    const { address } = useAccount()
    const { data: newtransactions, isFetching } = useGetActivesQuery(address ?? skipToken)
    const transactions = newtransactions?.filter(item => !(item.type == 'Order Limit' && item.status !== 'Pending'))

    return (
        <div>
            {!isFetching && transactions && (
                <>
                    {transactions.length > 0 ? <>{transactions.map((item, index) => {
                        let TypeCard: React.ElementType = TokenCardAcitve
                        let transaction: ActivesType = item

                        if (item.type.includes("Pay")) {
                            TypeCard = USDCardAcitve
                            transaction = item as USDActiveTransaction
                            return (
                                <div key={index} className="flex flex-col">
                                    <PaymentTransactionOverview transaction={transaction}>
                                        <div className="flex flex-col">
                                            <TypeCard transaction={transaction} />
                                        </div>
                                    </PaymentTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("NFT")) {
                            TypeCard = NFTCardAcitve
                            transaction = item as NFTActiveTransaction
                            return (
                                <div key={index} className="flex flex-col">
                                    <NFTTransactionOverview transaction={transaction}>
                                        <div className="flex flex-col">
                                            <TypeCard transaction={transaction} />
                                        </div>
                                    </NFTTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("Liquidity")) {
                            TypeCard = LiquidityCardAcitve
                            transaction = item as LiquidityActiveTransaction
                            return (
                                <div key={index} className="flex flex-col">
                                    <LiquidityTransactionOverview transaction={transaction}>
                                        <div className="flex flex-col">
                                            <TypeCard transaction={transaction} />
                                        </div>
                                    </LiquidityTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("Token")) {
                            TypeCard = TokenCardAcitve
                            transaction = item as TokenActiveTransaction
                            return (
                                <div key={index} className="flex flex-col">
                                    <TokenTransactionOverview transaction={transaction}>
                                        <div className="flex flex-col">
                                            <TypeCard transaction={transaction} />
                                        </div>
                                    </TokenTransactionOverview>
                                </div>
                            )
                        }
                        if (item.type.includes("Order")) {
                            TypeCard = OrderCardAcitve
                            transaction = item as OrderActiveTransaction
                            return (
                                <div key={index} className="flex flex-col" >
                                    <OrderLimitTransaction transaction={transaction}>
                                        <div className="flex flex-col" >
                                            <TypeCard transaction={transaction} />
                                        </div>
                                    </OrderLimitTransaction>
                                </div>
                            )
                        }
                        return (
                            <div key={index} className="flex flex-col" >
                                <TypeCard transaction={transaction} />
                            </div>
                        )
                    })}</> : <div className="flex flex-row justify-center items-start w-full my-[2vw]"> No actives</div>}
                </>
            )
            }
        </div >
    )
}