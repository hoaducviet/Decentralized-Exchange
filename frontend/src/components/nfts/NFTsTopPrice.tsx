'use client'
import { useRef, useState, } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide, } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules';
import Image from "next/image"
import { useGetTopCollectionsQuery } from '@/redux/features/api/apiSlice';
import { Card } from '@/components/ui/card';

export default function NFTsTopPrice() {
    const { data: collectionTop, isFetching } = useGetTopCollectionsQuery()
    const progressContent = useRef<HTMLSpanElement | null>(null);
    const [percent, setPercent] = useState<number>(0)

    const onAutoplayTimeLeft = (swiper: SwiperClass, time: number, progress: number) => {
        if (progressContent.current) {
            const offset = 125.6 * (progress);
            setPercent(offset)
            progressContent.current.textContent = `${Math.ceil(time / 1000)}`;
        }
    };

    return (
        <div className="select-none flex flex-col w-full shadow-md border-[1px] border-white/30 rounded-2xl">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                slidesPerView={1}
                loop={false}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                modules={[Autoplay, Pagination]}
                className="w-full h-[30vw] rounded-2xl"
            >
                {!isFetching && collectionTop?.length && collectionTop?.map(({ collection, nfts }, index) => (
                    <SwiperSlide key={index}>
                        <Image src={collection.banner} priority={true} alt={collection.name} width={20} height={20} className='w-full h-full layout:responsive object-cover object-center' />
                        <div className='absolute inset-0 bg-black/30'></div>
                        <div className='absolute bottom-20 left-0 right-0 z-20 h-[7vw] flex flex-row justify-center space-x-3'>
                            {nfts.length > 0 && nfts.map((nft, index) => (
                                <Card key={index} className='flex rounded-2xl shadow-2xl border-white'>
                                    <Image src={nft.img} priority={true} alt={nft.nft_id} width={20} height={20} className='w-[5vw] h-full layout:responsive object-cover object-center rounded-2xl' />
                                </Card>
                            ))}
                        </div>
                        <div className="absolute top-10 left-10 flex flex-col items-start text-6xl font-medium w-full text-white">
                            <p>Mosted exchange</p>
                            <p>Best prices</p>
                        </div>
                    </SwiperSlide>
                ))}
                <div className='absolute bottom-5 right-5  w-[3vw] h-[3vw] z-10'>
                    <svg className="absolute top-0 left-0 -rotate-90" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            className="stroke-white/70 fill-white/20 "
                            strokeWidth="3"
                            strokeDasharray="125.6"
                            strokeDashoffset={percent}
                        />
                    </svg>
                    <span ref={progressContent} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white  text-4"></span>
                </div>
            </Swiper>
        </div >
    )
}