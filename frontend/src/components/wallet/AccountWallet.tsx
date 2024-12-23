
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import { useDispatch } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { setIsOpen } from '@/redux/features/sidebar/sidebarSlice'

export default function Account() {
  const { address } = useAccount()
  const dispatch = useDispatch()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const addressConfig = (address ? address.slice(0, 6) + "..." + address.slice(38) : "")

  const handleClick = () => {
    dispatch(setIsOpen())
  }

  return (
    <div onClick={handleClick} className='cursor-pointer hover:bg-secondary/80 select-none flex flex-row'>
      <Avatar className="flex mr-1.5">
        <AvatarImage src={ensAvatar ? ensAvatar : "https://github.com/shadcn.png"} alt="@shadcn" />
        <AvatarFallback>V</AvatarFallback>
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
          : (<div className='flex ml-1.5'>{addressConfig}</div>)
        }
      </div>
    </div>
  )
}