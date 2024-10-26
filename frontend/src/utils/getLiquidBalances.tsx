import { BrowserProvider, JsonRpcSigner, formatUnits } from 'ethers'
import { loadLPTokenContract } from "@/utils/loadLPTokenContract"
import { LiquidBalancesType, Pool, Token, Address } from "@/lib/type"

interface Props {
    pools: Pool[];
    tokens: Token[];
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}

export const getLiquidBalances = async ({ pools, tokens, provider, address }: Props) => {

    const liquidBalances: LiquidBalancesType[] = await Promise.all(pools.map(async (pool) => {
        try {
            const contract = await loadLPTokenContract({ provider, address: pool.addressLPT })
            const value = await contract.balanceOf(address, { blockTag: "latest" })
            const decimals = Number(await contract.decimals())
            const formatted = formatUnits(value, decimals)
            const balanceFormatted = formatted.slice(0, formatted.indexOf(".") + 7)
            const symbol = await contract.symbol()
            const balance = {
                value: Number(value),
                symbol: symbol,
                formatted: balanceFormatted,
                decimals: decimals
            }

            const token1 = tokens.find(token => token.address === pool.addressToken1)
            const token2 = tokens.find(token => token.address === pool.addressToken2)

            return {
                info: { ...pool, token1, token2 },
                balance: balance
            }
        } catch (error) {
            console.error(`Error processing pool ${pool.name}:`, error);
            throw error;
        }
    }))
    return liquidBalances;
}