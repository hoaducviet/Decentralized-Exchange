'use client'
import { increment } from "@/redux/features/counter/counterSlice";
import { useDispatch } from "react-redux";
import { useCounter } from "@/hooks/useStore";

export default function Home() {
  const count = useCounter()
  const dispatch = useDispatch()

  return (
    <>
      <div>{count.value}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </>
  )
}
