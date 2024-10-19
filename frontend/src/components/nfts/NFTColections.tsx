

import { Card} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'


const list = [
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
    {
        id: '1',
        name: 'Pudgy Penguins',
        img: 'https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png',
        floor: '11.45 ETH',
        volume: '100 ETH',
        volumeChange: '100%',
        items: 1200,
        owners: 53233
    },
]

export default function NFTColections() {

    return (
        <div className='select-none flex flex-col w-full'>
            <p className='text-2xl font-semibold'>NFT collections</p>
            <Card className='w-full border-none outline-none shadow-sm'>
                <div className='flex flex-row justify-start items-center pl-[2vw] h-[3vw]'>
                    <p className='w-[35%]'>Collection name</p>
                    <div className='flex flex-row justify-start w-[65%]'>
                        <p className='flex flex-row justify-start w-[20%]'>Floor</p>
                        <p className='flex flex-row justify-start w-[20%]'>Volume</p>
                        <p className='flex flex-row justify-start w-[20%]'>Volume change</p>
                        <p className='flex flex-row justify-start w-[20%]'>Items</p>
                        <p className='flex flex-row justify-start w-[20%]'>Owners</p>
                    </div>
                </div>
                <div className='flex flex-col w-full pl-[2vw]'>
                    {list.map((item, index) => {
                        return (
                            <Link key={index} href={`/nfts/${item.id}`} className='flex flex-col w-full'>
                                <div className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center h-[4vw]'>
                                    <div className='flex flex-row items-center space-x-[0.5vw] w-[35%] text-md'>
                                        <p>{index + 1}</p>
                                        <Avatar className="ml-[0.5vw]">
                                            <AvatarImage src={item.img} />
                                            <AvatarFallback>{item.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <p className='font-medium'>{item.name}</p>
                                    </div>
                                    <div className='flex flex-row justify-between items-center text-md font-medium w-[65%]'>
                                        <p className='flex flex-row justify-start w-[20%]'>{item.floor}</p>
                                        <p className='flex flex-row justify-start w-[20%]'>{item.volume}</p>
                                        <p className='flex flex-row justify-start w-[20%]'>{item.volumeChange}</p>
                                        <p className='flex flex-row justify-start w-[20%]'>{item.items}</p>
                                        <p className='flex flex-row justify-start w-[20%]'>{item.owners}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}