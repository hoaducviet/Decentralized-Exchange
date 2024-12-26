'use client'
import { apiSlice } from '@/redux/features/api/apiSlice'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Account, Address, Pool, ReservePool, Token } from "@/lib/type";

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
    tagTypes: ['Account', 'Suspended Token', 'Suspended Pool'],
    endpoints: (builder) => ({
        getAccounts: builder.query<Account[], void>({
            query: () => `/accounts`,
            providesTags: ['Account']
        }),
        getSuspendedTokens: builder.query<Token[], void>({
            query: () => `/tokens/suspended`,
            providesTags: ['Suspended Token']
        }),
        getSuspendedPools: builder.query<Pool[], void>({
            query: () => `/pools/suspended`,
            providesTags: ['Suspended Pool']
        }),


        //Token
        updateTokens: builder.mutation<Token[], void>({
            query: () => ({
                url: '/update/tokens',
                method: 'POST',
            }),
            invalidatesTags: ['Suspended Token'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Token']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        deleteToken: builder.mutation<Token, { _id: string }>({
            query: (data) => ({
                url: '/delete/token',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Suspended Token'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Token']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        activeToken: builder.mutation<Token, { _id: string }>({
            query: (data) => ({
                url: '/active/token',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Suspended Token'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Token']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        createToken: builder.mutation<Token, Partial<Token>>({
            query: (data) => ({
                url: '/create/token',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Suspended Token'],
        }),
        addToken: builder.mutation<Token, Partial<Token>>({
            query: (data) => ({
                url: '/add/token',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Suspended Token'],
        }),


        //Pool
        updatePools: builder.mutation<Pool[], void>({
            query: () => ({
                url: '/update/pools',
                method: 'POST',
            }),
            invalidatesTags: ['Suspended Pool'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Pool']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        deletePool: builder.mutation<Pool, { _id: string }>({
            query: (data) => ({
                url: '/delete/pool',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Suspended Pool'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Pool']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        activePool: builder.mutation<Pool, { _id: string }>({
            query: (data) => ({
                url: '/active/pool',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Suspended Pool'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Pool']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        updateReserves: builder.mutation<ReservePool[], void>({
            query: () => ({
                url: '/update/reserves',
                method: 'POST',
            }),
        }),

        //Account
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
        deleteAccount: builder.mutation<Account, { _id: string }>({
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
    useGetSuspendedTokensQuery,
    useGetSuspendedPoolsQuery,

    useUpdateTokensMutation,
    useDeleteTokenMutation,
    useActiveTokenMutation,
    useCreateTokenMutation,
    useAddTokenMutation,

    useUpdatePoolsMutation,
    useDeletePoolMutation,
    useActivePoolMutation,

    useUpdateReservesMutation,
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation
} = adminSlice