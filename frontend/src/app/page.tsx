'use client'

import { increment } from "@/redux/features/counter/counterSlice";
import { useDispatch } from "react-redux";
import { useCounter } from "@/hooks/useStore";

import { useWeb3 } from "@/hooks/useWeb3";

export default function Home() {

  const count = useCounter()
  const dispatch = useDispatch()
  const context = useWeb3()
  console.log(context?.isLoaded)


  return (
    <>
      <div>{count.value}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </>
  )
}
