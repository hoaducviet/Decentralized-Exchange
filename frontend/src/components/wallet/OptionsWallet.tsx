import * as React from 'react'
import Image from 'next/image'
import { useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export default function OptionsWallet() {
  const { connectors, connect } = useConnect()
  const hasConnectors = connectors.filter(connector => !!connector.icon)

  return (
    <div>
      {hasConnectors.map((connector) => (
        <Button
          variant="outline"
          key={connector.id}
          className="flex flex-row justify-start w-full"
          onClick={() => connect({ connector })}
        >
          <Image
            src={connector.icon?.trimStart() || "/image/default-image.png"}
            alt={connector.name}
            className="mx-5" width="36" height="36" />
          <div className="mx-5">
            {connector.name}
          </div>
        </Button>
      ))}
    </div>
  )
}