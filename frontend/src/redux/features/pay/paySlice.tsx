'use client'
import { apiSlice } from '@/redux/features/api/apiSlice'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderIdPay, Payout, USDTransaction } from "@/lib/type";
import API from '@/config/configApi'

export const paySlice = createApi({
    reducerPath: 'paySlice',
    baseQuery: fetchBaseQuery({ baseUrl: `${API.backendUrl}/pay` }),
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
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['TokenBalance']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        addPayment: builder.mutation<USDTransaction, Partial<USDTransaction>>({
            query: (data) => ({
                url: '/paypal/payment',
                method: 'POST',
                body: data
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['TokenBalance']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        })
    })
})


export const {
    useCreateOrderIdPayMutation,
    useAddPayoutMutation,
    useAddPaymentMutation
} = paySlice