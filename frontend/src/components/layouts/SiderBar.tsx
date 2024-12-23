'use client'
import { useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useDispatch } from 'react-redux'
import { useSidebar } from '@/hooks/useSidebar'
import { useGetTokenBalancesQuery } from '@/redux/features/api/apiSlice'
import { useGetLiquidityBalancesQuery } from '@/redux/features/api/apiSlice'
import { setIsOpen } from '@/redux/features/sidebar/sidebarSlice'
import AddressBalance from '@/components/AddressBalance'
import ActionsManagement from '@/components/ActionsManagement'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { LayersIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Address } from '@/lib/type'
import { useToast } from '@/hooks/useToast'
interface Props {
    address: Address;
}

export default function SiderBar({ address }: Props) {
    const { disconnect } = useDisconnect()
    const { isOpen } = useSidebar()
    const dispatch = useDispatch()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address)
    const { data: liquidBalances } = useGetLiquidityBalancesQuery(address)
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
    const addressConfig = (address ? address.slice(0, 6) + "..." + address.slice(38) : "")
    const usdBalances = tokenBalances?.find(tokenBalance => tokenBalance.info.symbol === 'USD')
    const { showInfo } = useToast()
    const handleCopy = async () => {
        await navigator.clipboard.writeText(address)
        showInfo(
            "Copied address successfully!",
            `Address: ${address.slice(0, 8) + "..." + address.slice(35)}`
        )
    }

    const handleDisconnect = () => {
        disconnect()
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token')
        }
    }
    return (
        <div className={`absolute bg-white dark:bg-black border-l-[0.1px] dark:border-white/20 border-gray-200 select-none top-0 right-0 flex flex-col h-[100vh] overflow-hidden z-10 animation-ping duration-300 ${isOpen ? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col'>
                <div className='flex flex-row justify-between items-center m-[0.5vw] h-16'>
                    <div className='flex flex-row justify-start items-center'>
                        <Avatar className='mr-[0.5vw]'>
                            <AvatarImage src={ensAvatar || "https://github.com/shadcn.png"} />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col justify-center text-lg font-medium '>
                            {ensName ? <p>{ensName}</p> : <p>anonymous</p>}
                            <div className='flex flex-row'>
                                {address && <p className='text-sm ml-[0.1vw]'>{addressConfig}</p>}
                                <Button onClick={handleCopy} variant="ghost" className='h-2 p-2' >
                                    <LayersIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" className='bg-transparent flex justify-center items-center rounded-3xl w-[30%] mx-[1vw]' onClick={handleDisconnect}>Disconnect</Button>
                    <Button onClick={() => dispatch(setIsOpen())} variant="ghost" className='w-[20%] rounded-3xl'><DoubleArrowRightIcon /></Button>
                </div>
                <div className='flex flex-row justify-start items-center text-xl space-x-[0.5vw] mx-[1.5vw] my-[0.5vw]'>
                    <p className='font-semibold'>USD:</p>
                    <div className='flex flex-row'>
                        <p>$</p>
                        <p>{usdBalances?.balance?.formatted}</p>
                    </div>
                </div>
                <div className='flex flex-col items-center w-full z-100'>
                    <ActionsManagement />
                </div>
            </div>
            <div className='w-full overflow-y-auto'>
                <AddressBalance tokenBalances={tokenBalances} liquidBalances={liquidBalances} />
            </div>
        </div>
    )
}
