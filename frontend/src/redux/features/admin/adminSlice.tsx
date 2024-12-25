'use client'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Account } from "@/lib/type";

export const adminSlice = createApi({
    reducerPath: 'adminSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_API ? process.env.NEXT_PUBLIC_BACKEND_API : "http://localhost"}/admin`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        }
    }),
    endpoints: (builder) => ({
        getAccounts: builder.query<Account[], void>({
            query: () => `/accounts`
        }),

    })
})


export const {
    useGetAccountsQuery
} = adminSlice