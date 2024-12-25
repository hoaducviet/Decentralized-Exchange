'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useDisconnect } from 'wagmi';

interface TokenPayload {
    wallet: string;
    role: string;
    exp: string;
}

const useAuthCheck = () => {
    const router = useRouter();
    const { disconnect } = useDisconnect()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                const currentTime = Math.floor(Date.now() / 1000);
                if (Number(decoded.exp) < currentTime) {
                    localStorage.removeItem('token');
                    disconnect()
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                disconnect()
            }
        } else {
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);
};

export default useAuthCheck;
