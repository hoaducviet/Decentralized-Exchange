'use client'
import { useCollections } from '@/hooks/useCollections'
import NFTsTopPrice from '@/components/nfts/NFTsTopPrice'
import NFTColections from '@/components/nfts/NFTColections'
import { resetCurrentCollection } from '@/redux/features/collection/collectionSlice'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
export default function NFT() {
    const dispatch = useDispatch()
    const { collections } = useCollections()
    useEffect(() => {
        dispatch(resetCurrentCollection())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='flex flex-col justify-start items-center w-full min-h-[100vh] px-[15vw] py-[4vw]'>
            <div className='w-full'>
                <NFTsTopPrice />
            </div>
            <div className='w-full'>
                <NFTColections collections={collections} />
            </div>
        </div>
    )
}