'use client'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Account, Address } from "@/lib/type";

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
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 600,
    tagTypes: ['Account'],
    endpoints: (builder) => ({
        getAccounts: builder.query<Account[], void>({
            query: () => `/accounts`,
            providesTags: ['Account']
        }),


        createAccount: builder.mutation<Account, { address: Address, role: string }>({
            query: (data) => ({
                url: '/insert/account',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Account']
        }),
        updateAccount: builder.mutation<Account, Account>({
            query: (data) => ({
                url: '/update/account',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Account']
        }),
        deleteAccount: builder.mutation<Account, {_id: string}>({
            query: (data) => ({
                url: '/delete/account',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Account']
        }),

    })
})


export const {
    useGetAccountsQuery,

    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation
} = adminSlice