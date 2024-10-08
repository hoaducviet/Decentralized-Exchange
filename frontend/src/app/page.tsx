'use client'

import { increment } from "@/redux/features/counter/counterSlice";
import { useDispatch } from "react-redux";
import { useCounter } from "@/hooks/useStores";

import Wallet from "@/components/wallet/Wallet";




export default function Home() {

  const count = useCounter()
  const dispatch = useDispatch()

  return (
    <>
      <Wallet />
      <div>{count.value}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </>
  )
}
