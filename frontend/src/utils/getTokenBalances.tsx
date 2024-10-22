import { BrowserProvider, formatUnits } from 'ethers'
import { loadTokenContract } from "@/utils/loadTokenContract"
import { TokenBalancesType, Token, Address } from "@/lib/type"

interface Props {
    tokens: Token[];
    provider: BrowserProvider;
    address: Address;
}

export const getTokenBalances = async ({ tokens, provider, address }: Props) => {


    const tokenBalances: TokenBalancesType[] = await Promise.all(tokens.map(async (token) => {

        if (token.symbol === "ETH") {
            const ethBalance = await provider.getBalance(address)
            return {
                info: token,
                balance: {
                    value: Number(ethBalance),
                    symbol: token.symbol,
                    formatted: formatUnits(ethBalance, token.decimals),
                    decimals: 18
                }
            }
        }

        const contract = await loadTokenContract({ provider, address: token.address })
        const value = await contract.balanceOf(address)
        const decimals = Number(await contract.decimals())
        const formatted = formatUnits(value, decimals)
        const symbol = await contract.symbol()

        const balance = {
            value: Number(value),
            symbol: symbol,
            formatted: formatted,
            decimals: decimals
        }

        return {
            info: token,
            balance: balance
        }
    }))
    return tokenBalances;

}