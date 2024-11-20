
import io, { Socket } from "socket.io-client";
import { getAddressFromLocalStorage } from '@/utils/getAddressFromLocalStorage'
import { Address } from '@/lib/type'

const wsGeneral: Socket = io(process.env.NEXT_PUBLIC_BACKEND_API)
let wss: Socket

const getSocket = (): Socket => {
    const address: Address | string | undefined = getAddressFromLocalStorage() as Address;
    if (!wss && address) {
        const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_API, {
            query: {
                wallet: address,
            }
        })
        if (socket) {
            wss = socket
        }
    }
    return wss!;
};

export { getSocket, wsGeneral }