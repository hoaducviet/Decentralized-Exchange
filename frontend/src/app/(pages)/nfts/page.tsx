
import NFTsTopPrice from '@/components/nfts/NFTsTopPrice'
import NFTColections from '@/components/nfts/NFTColections'

export default function NFT() {
    return (
        <div className='flex flex-col justify-start items-center w-full min-h-[100vh] px-[15vw] py-[4vw]'>
            <div className='w-full'>
                <NFTsTopPrice />
            </div>
            <div className='w-full'>
                <NFTColections />
            </div>
        </div>
    )
}