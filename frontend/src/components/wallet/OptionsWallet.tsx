import * as React from 'react'
import { useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export default function OptionsWallet() {
  const { connectors, connect } = useConnect()
  const hasConnectors = connectors.filter(connector => !!connector.icon)

  return (
    <div>
      {hasConnectors.map((connector) => (
        <Button
          key={connector.id}
          className="flex flex-row justify-start w-full"
          onClick={() => connect({ connector })}
        >
          <img
            src={connector.icon}
            alt={connector.name}
            className="mx-5" width="36px" height="36px" />
          <div className="mx-5">
            {connector.name}
          </div>
        </Button>
      ))}
    </div>
  )
}