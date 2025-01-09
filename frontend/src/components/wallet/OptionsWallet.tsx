'use client'
import * as React from 'react'
import Image from 'next/image'
import { useConnect } from 'wagmi'

export default function OptionsWallet() {
  const { connectors, connect } = useConnect()
  const hasConnectors = connectors.filter(connector => !!connector.icon)

  return (
    <div>
      {hasConnectors.map((connector) => (
        <div
          key={connector.id}
          className="bg-transparent hover:bg-secondary/80 dark:hover:bg-white/20 cursor-pointer rounded-2xl flex flex-row justify-start items-center w-full h-[3vw]"
          onClick={() => connect({ connector })}
        >
          <Image
            src={connector.icon?.trimStart() || "/image/default-image.png"}
            priority={true}
            alt={connector.name}
            className="mx-5 w-[1.5vw] h-[1.5vw] object-cover" width="36" height="36" />
          <div className="mx-5">
            {connector.name}
          </div>
        </div>
      ))}
    </div>
  )
} 