'use client'
import { jwtDecode } from 'jwt-decode';
import { useAccount } from 'wagmi';

interface TokenPayload {
    wallet: string;
    role: string;
}

export const useRole = (token: string) => {
    const { address } = useAccount()
    if (token) {
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            const { wallet, role } = decoded
            return wallet === address ? role : 'user'
        } catch {
            return 'guest'
        }
    }
    return 'guest'
}
