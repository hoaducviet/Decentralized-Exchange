
import io, { Socket } from "socket.io-client";
import { getAddressFromLocalStorage } from '@/utils/getAddressFromLocalStorage'
import { Address } from '@/lib/type'

const wsGeneral: Socket = io(process.env.NEXT_PUBLIC_BACKEND_API)
let wss: Socket | undefined

const getSocket = async () => {
    const address: Address | string | undefined = getAddressFromLocalStorage() as Address;
    if (!wss && address) {
        const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost', {
            query: {
                wallet: address,
            }
        })
        if (socket) {
            wss = socket;
            return socket
        };
    } else if (wss && !address) {
        wss = undefined
        return wss
    }
    return wss!;
};

export { getSocket, wsGeneral }