import { LiquidBalancesType, TokenBalancesType } from "@/lib/type"

interface Props {
    liquidBalances: LiquidBalancesType[];
    tokenOne: TokenBalancesType;
    tokenTwo: TokenBalancesType;
}

export const getLiquidityPool = ({ liquidBalances, tokenOne, tokenTwo }: Props) => {
    const liquidBalance = liquidBalances.find(liquidityPool => (liquidityPool.info.token1?.address === tokenOne?.info.address || liquidityPool.info.token1?.address === tokenTwo?.info.address) && (liquidityPool.info.token2?.address === tokenOne?.info.address || liquidityPool.info.token2?.address === tokenTwo?.info.address))
    return liquidBalance
}