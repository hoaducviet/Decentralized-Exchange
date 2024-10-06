'use client'

import { increment } from "@/redux/features/counter/counterSlice";
import { useDispatch } from "react-redux";
import { useCounter } from "@/hooks/useStores";
import { useAccount } from 'wagmi'

import { Account } from "@/app/Account";
import { WalletOptions } from "@/components/wallet/WalletOptions";
import Wallet from "@/components/wallet/Wallet";


function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}


export default function Home() {

  const count = useCounter()
  const dispatch = useDispatch()

  return (
    <>
      <ConnectWallet />
      <Wallet />
      <div>{count.value}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </>
  )
}
