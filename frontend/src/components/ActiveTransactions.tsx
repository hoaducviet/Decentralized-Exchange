'use client'
import { useAccount } from "wagmi"
import { useGetActivesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import NFTCardAcitve from "@/components/NFTCardActive"
import TokenCardAcitve from "@/components/TokenCardActive"
import LiquidityCardAcitve from "@/components/LiquidityCardActive"
import USDCardAcitve from "@/components/USDCardActive"
import OrderCardAcitve from "@/components/OrderCardActive"
import { ActivesType, NFTActiveTransaction, TokenActiveTransaction, LiquidityActiveTransaction, USDActiveTransaction, OrderActiveTransaction } from "@/lib/type"
import OrderLimitTransaction from "@/components/transaction/OrderLimitTransaction"

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
                        }
                        if (item.type.includes("NFT")) {
                            TypeCard = NFTCardAcitve
                            transaction = item as NFTActiveTransaction
                        }
                        if (item.type.includes("Liquidity")) {
                            TypeCard = LiquidityCardAcitve
                            transaction = item as LiquidityActiveTransaction
                        }
                        if (item.type.includes("Token")) {
                            TypeCard = TokenCardAcitve
                            transaction = item as TokenActiveTransaction
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