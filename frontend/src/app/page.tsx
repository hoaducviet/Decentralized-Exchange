'use client'

import { useEffect } from "react"
import { useWeb3 } from '@/hooks/useWeb3'


export default function Home() {
  const context = useWeb3()



  useEffect(() => {
    if (!!context) {
      const { contracts } = context
      console.log(contracts)
      const app = async () => {

        const result = await contracts?.look.reserve1()

        // console.log(result)
      }


      app()

    }
  }, [context])


  return (
    <>

    </>
  )
}
