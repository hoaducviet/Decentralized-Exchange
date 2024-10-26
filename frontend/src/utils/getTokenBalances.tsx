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
        try {
            if (token.symbol === "ETH") {
                const ethBalance = await provider.getBalance(address)
                const ethFormatted = formatUnits(ethBalance, token.decimals)
                const balanceFormatted = ethFormatted.slice(0, ethFormatted.indexOf(".") + 7)
                return {
                    info: token,
                    balance: {
                        value: Number(ethBalance),
                        symbol: token.symbol,
                        formatted: balanceFormatted,
                        decimals: 18
                    }
                }
            }

            const contract = await loadTokenContract({ provider, address: token.address })
            const value = await contract.balanceOf(address)
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
            return {
                info: token,
                balance: balance
            }
        } catch (error) {
            console.error(`Error processing token ${token.name}`, error);
            throw error;
        }
    }))
    return tokenBalances;

}