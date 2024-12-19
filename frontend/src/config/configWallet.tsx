
import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, base, hardhat } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'


export const configWallet = createConfig({
  chains: [mainnet, sepolia, hardhat, base],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
    [base.id]: http(),
  },
})

