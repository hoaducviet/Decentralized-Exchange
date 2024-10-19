'use client'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const list = [
    {
        id: '1234',
        name: "monkey",
        img: 'https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://images.wsj.net/im-491396?width=700&height=700',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnjmC_6ixRlFykJozChIPioRbsBleCL-yPqBVPyLZCgN1Kgq_w8VQQDlRnFWpZJCUCAhQ&usqp=CAU',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://images.wsj.net/im-491396?width=700&height=700',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://images.wsj.net/im-491396?width=700&height=700',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnjmC_6ixRlFykJozChIPioRbsBleCL-yPqBVPyLZCgN1Kgq_w8VQQDlRnFWpZJCUCAhQ&usqp=CAU',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://images.wsj.net/im-491396?width=700&height=700',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://images.wsj.net/im-491396?width=700&height=700',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnjmC_6ixRlFykJozChIPioRbsBleCL-yPqBVPyLZCgN1Kgq_w8VQQDlRnFWpZJCUCAhQ&usqp=CAU',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },
    {
        id: '1234',
        name: "monkey",
        img: 'https://images.wsj.net/im-491396?width=700&height=700',
        price: '100 ETH',
        seller: '0x3123...asdf'
    },

]
const options = [
    {
        name: 'Item'
    },
    {
        name: 'Event'
    },
    {
        name: 'Price'
    },
    {
        name: 'By'
    },
    {
        name: ''
    },
]

export default function Listed() {

    return (
        <div className="flex flex-col select-none h-full">
            <div className="flex flex-row justify-between items-center text-sm font-semibold opacity-60 h-[3vw] px-[1.5vw]">
                {options.map((option, index) => {
                    return (
                        <div key={index} className="flex justify-start w-[20%]">
                            {option.name}
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col">
                {list.map((nft, index) => {
                    return (
                        <div key={index} className="cursor-pointer flex flex-row justify-between items-center border-gray-200 border-b-[0.1px] h-[6vw] px-[1.5vw]">
                            <div className="flex flex-row justify-start items-center w-[20%] h-full space-x-[0.5vw]">
                                <Image src={nft.img} alt={nft.name} width={20} height={20} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                <div>#{nft.id}</div>
                            </div>
                            <div className="flex justify-start w-[20%]">Listed</div>
                            <div className="flex justify-start w-[20%]">{nft.price}</div>
                            <div className="flex justify-start w-[20%]">{nft.seller}</div>
                            <div className="flex justify-start w-[20%]">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="secondary">Buy</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}