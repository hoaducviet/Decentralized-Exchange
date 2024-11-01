'use client'

import { useEffect, useState } from 'react'
import axios from 'axios';
import { useAccount } from 'wagmi';

import PaypalButton from '@/components/payment/PaypalButton'
import Image from 'next/image'


export default function Paypal() {
    const [orderId, setOrderId] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')

    const { address } = useAccount()
    const value = "25"
    console.log(orderId, qrCode)

    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8000/payment/paypal/orderid",
                    { address, value }, {
                    timeout: 10000,
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
                    {qrCode && <Image src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=150x150` || "/image/default-image.png"} alt='qrcode' width={20} height={20} className='w-full h-full' />}
                </div>
                <div className='flex flex-col w-[60%]'>
                    <div>

                    </div>
                    <div className='bg-blue-300 '>
                        {orderId && <PaypalButton orderId={orderId} />}
                    </div>
                </div>
            </div>
        </div>
    )
}