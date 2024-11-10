'use client'
import { useAccount } from "wagmi"
import { useGetActivesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import NFTCardAcitve from "@/components/NFTCardActive"
import TokenCardAcitve from "@/components/TokenCardActive"
import LiquidityCardAcitve from "@/components/LiquidityCardActive"
import USDCardAcitve from "@/components/USDCardActive"
import { ActivesType, NFTActiveTransaction, TokenActiveTransaction, LiquidityActiveTransaction, USDActiveTransaction } from "@/lib/type"

export default function ActiveTransactions() {
    const { address } = useAccount()
    const { data: transactions, isFetching } = useGetActivesQuery(address ?? skipToken)
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
                        return (
                            <div key={index} className="flex flex-col" >
                                <TypeCard transaction={transaction} />
                            </div>
                        )
                    })}</> : <div> No actives</div>}
                </>
            )
            }
        </div >
    )
}