
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const addressConfig = (address ? address.slice(0, 6) + "..." + address.slice(38) : "")

  return (
    <div className='flex flex-row'>
      <Avatar className="flex mx-2">
        <AvatarImage src={ensAvatar ? ensAvatar : "https://github.com/shadcn.png"} alt="@shadcn" />
        <AvatarFallback>Account</AvatarFallback>
      </Avatar>
      <div className='flex items-center'>
        {ensName ? (
          <div className='flex flew-col'>
            <div className='w-full'>
              {ensName}
            </div>
            <div className='text-sm'>
              ({addressConfig})
            </div>
          </div>
        )
          : <div>{addressConfig}</div>
        }
      </div>
    </div>
  )
}