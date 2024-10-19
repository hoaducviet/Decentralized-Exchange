'use client'

import NFTItem from "@/components/nfts/NFTItem"

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

export default function NFTCards() {

    return (
        <div className="flex flex-wrap flex-start gap-x-[1.5%] gap-y-[1vw]">
            {list.map((nft, index) => {
                return (
                    <div key={index} className="w-[18.8%]">
                        <NFTItem nft={nft} />
                    </div>
                )
            })}
        </div>
    )
}