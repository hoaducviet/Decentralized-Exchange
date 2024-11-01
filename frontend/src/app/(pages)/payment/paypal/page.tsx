'use client'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useDeposit } from '@/hooks/useDeposit';
import Image from 'next/image'
import PaypalButton from '@/components/payment/PaypalButton'

export default function Paypal() {
    const { address } = useAccount()
    const { amount } = useDeposit()
    const [orderId, setOrderId] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')

    console.log(orderId, qrCode)

    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8000/payment/paypal/orderid",
                    { address, amount }, {
                    timeout: 100000,
                })
                if (response.status === 200) {
                    setOrderId(response.data.id)
                    setQrCode(response.data.url)
                }
            } catch (error) {
                console.error(error)
            }
        }
        getInfo()
    }, [])

    return (
        <div className=' flex flex-col justify-start items-center w-full my-[15vw]'>
            <div className='flex flex-row w-[50vw] space-x-[2vw]'>
                <div className='flex w-[40%]'>
                    <Image src={qrCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=150x150` : "/image/default-image.png"} alt='qrcode' width={20} height={20} className='w-full h-full' />
                </div>
                <div className='flex flex-col w-[60%]'>
                    <div>

                    </div>
                    <div className='bg-blue-300 '>
                        {<PaypalButton orderId={orderId} />}
                    </div>
                </div>
            </div>
        </div>
    )
}