'use client'
import { useDispatch } from 'react-redux';
import { useAccount, useBalance } from 'wagmi'
import { setBalances } from '@/redux/features/wallet/walletSlice';
import tokenList from "@/assets/token/tokenList.json";
import tokenETH from "@/assets/token/tokenETH.json";
import { type Token, type BalancesType } from '@/lib/type'

const tokens: Token[] = tokenList as Token[];
const eth: Token = tokenETH as Token;
export function useLoadBalance() {
    const { address } = useAccount()
    const dispatch = useDispatch()
    const { data: ethBalance } = useBalance({ address })
    let balances: BalancesType[] = [{ token: eth, balance: ethBalance }]

    const tokenBalances = tokens.map((token) => {
        const { data: balance } = useBalance({
            address,
            token: token.address
        });
        return { token, balance };
    });

    balances = [...balances, ...tokenBalances]
    const hasToken = balances.filter(({ balance }) => (!!balance && !!balance?.value))
    const newBalances = hasToken.map(({ token, balance }) => {
        return {
            token,
            balance: {
                ...balance,
                value: Number(balance?.value)
            }
        }
    })

    dispatch(setBalances(newBalances))
    return { balances: newBalances }
}