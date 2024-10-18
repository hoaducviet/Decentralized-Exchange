
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const list = [
    {
        id: 1,
        name: 'Monkey',
        img: "https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png"
    }
]

export default function NFTsTopPrice() {

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col items-start text-6xl font-medium w-full">
                <p>Mosted exchange</p>
                <p>Best prices</p>
            </div>
            <div className="flex flex-col w-full">
                <Carousel>
                    <CarouselContent>
                        {list.map((item, index) => {
                            return (
                                <CarouselItem className="basis-1/3">
                                    <Image src={item.img} alt={item.name} width={100} height={100} />
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                </Carousel>

            </div>
        </div>
    )
}