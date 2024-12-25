'use client'
import { useToast } from "@/hooks/useToast"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { useGetAccountsQuery } from "@/redux/features/admin/adminSlice"
import { LayersIcon } from "@radix-ui/react-icons"
import { Address } from "@/lib/type"

const options = ['#', 'Address', 'Role', 'Active', 'Created At']
const list = ['Total', 'Create New Account']
export default function AccountAdmin() {
    const { data: accounts } = useGetAccountsQuery()
    const { showInfo } = useToast()

    const handleCopy = async (address: Address) => {
        await navigator.clipboard.writeText(address)
        showInfo(
            "Copied address successfully!",
            `Address: ${address.slice(0, 8) + "..." + address.slice(35)}`
        )
    }

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[8vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${accounts?.length} Accounts`}</p>
                </div>
                <div className="flex flex-row justify-end items-center space-x-[1vw]">
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-md space-x-2 h-[3vw] px-[1vw]">
                        <PlusCircleIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold">{list[1]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md max-h-[79vh] overflow-y-auto">
                    <div className="w-full">
                        <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                            <p className="w-[5%] flex flex-row justify-start items-center">{options[0]}</p>
                            <p className="w-[30%] flex flex-row justify-start items-center">{options[1]}</p>
                            <p className="w-[15%] flex flex-row justify-start items-center">{options[2]}</p>
                            <p className="w-[15%] flex flex-row justify-start items-center">{options[3]}</p>
                            <p className="w-[20%] flex flex-row justify-start items-center">{options[4]}</p>
                            <p className="w-[15%] flex flex-row justify-end items-center"></p>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-x-hidden">
                        {accounts && accounts.map((account, index) => {
                            const createdDate = new Date(account.createdAt).toLocaleString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            });
                            return (
                                <div key={index} className={`flex flex-row cursor-pointer hover:bg-secondary/30 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === accounts.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                    <p className="font-medium w-[5%]">{index + 1}</p>
                                    <div className="flex flex-row justify-start items-center space-x-2 w-[30%]">
                                        <p>{`${account.address.slice(0, 12)}...${account.address.slice(30)}`}</p>
                                        <Button onClick={() => handleCopy(account.address)} variant="ghost" className='h-2 p-2' >
                                            <LayersIcon />
                                        </Button>
                                    </div>
                                    <p className="flex flex-row justify-start w-[15%]">{account.role}</p>
                                    <p className="flex flex-row justify-start w-[15%]">{account.active ? "True" : "False"}</p>
                                    <p className="flex flex-row justify-start w-[20%]">{createdDate}</p>
                                    <div className="flex flex-row justify-around w-[15%]">
                                        <Button variant="outline">Edit</Button>
                                        <Button variant="outline">Delete</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}