import { BrowserProvider, formatUnits } from 'ethers'
import { loadLiquidContract } from '@/utils/loadLiquidContract';
import { LiquidBalancesType, TokenBalancesType } from "@/lib/type"

interface Props {
    provider: BrowserProvider;
    pool: LiquidBalancesType;
    tokenOne: TokenBalancesType;
}

export const getReservePairPool = async ({ provider, pool, tokenOne }: Props) => {
    const isEth = pool?.info.token2?.symbol !== 'ETH' ? false : true;

    const contract = await loadLiquidContract({ provider, address: pool?.info?.address, isEth: isEth });
    const value1 = await contract.reserve1()
    const value2 = await contract.reserve2()
    const reserve1 = formatUnits(value1, pool?.info.decimals1)
    const reserve2 = formatUnits(value2, pool?.info.decimals2)

    if (tokenOne.info.address === pool.info.addressToken1) {
        return { reserve1: Number(reserve1), reserve2: Number(reserve2) }
    }
    return { reserve1: Number(reserve2), reserve2: Number(reserve1) }
}