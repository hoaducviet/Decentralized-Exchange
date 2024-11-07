'use client'

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderIdPay, Payout, USDTransaction } from "@/lib/type";

export const paySlice = createApi({
    reducerPath: 'paySlice',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_API}/pay` }),
    endpoints: (builder) => ({

        createOrderIdPay: builder.mutation<{ id: string, url: string }, OrderIdPay>({
            query: (data) => ({
                url: '/paypal/orderid',
                method: 'POST',
                body: data
            })
        }),
        addPayout: builder.mutation<USDTransaction, Payout>({
            query: (data) => ({
                url: '/paypal/payout',
                method: 'POST',
                body: data
            })
        }),
        addPayment: builder.mutation<USDTransaction, Partial<USDTransaction>>({
            query: (data) => ({
                url: '/paypal/payment',
                method: 'POST',
                body: data
            })
        })
    })
})


export const {
    useCreateOrderIdPayMutation,
    useAddPayoutMutation,
    useAddPaymentMutation
} = paySlice