
import io, { Socket } from "socket.io-client";
import { getAddressFromLocalStorage } from '@/utils/getAddressFromLocalStorage'
import { Address } from '@/lib/type'
import API from "@/config/configApi";

let wsGeneral: Socket
let wss: Socket | undefined


const getGeneralSocket = () => {
    if (!wsGeneral) {
        const newSocket: Socket = io(`${API.backendUrl}/general`, {
            reconnectionDelayMax: 10000,
            forceNew: true
        })
        if (newSocket) {
            wsGeneral = newSocket;
            return newSocket
        }
    }
    return wsGeneral
}

const getSocket = async () => {
    const address: Address | string | undefined = getAddressFromLocalStorage() as Address;
    if (!wss && address) {
        const socket: Socket = io(`${API.backendUrl}/personal`, {
            reconnectionDelayMax: 10000,
            query: {
                "wallet": address
            },
            forceNew: true
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

export { getSocket, getGeneralSocket }