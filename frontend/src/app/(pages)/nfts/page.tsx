'use client'
import NFTsTopPrice from '@/components/nfts/NFTsTopPrice'
import NFTColections from '@/components/nfts/NFTColections'
import { useGetCollectionsQuery } from '@/redux/features/api/apiSlice'
export default function NFTs() {
    const { data: collections, isFetching } = useGetCollectionsQuery()
    return (
        <div className='flex flex-col justify-start items-center w-full min-h-[100vh] px-[15vw] py-[4vw]'>
            <div className='w-full'>
                <NFTsTopPrice />
            </div>
            {!isFetching && collections &&
                <div className='w-full'>
                    <NFTColections collections={collections} />
                </div>
            }
        </div>
    )
}