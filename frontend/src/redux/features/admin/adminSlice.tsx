'use client'
import { apiSlice } from '@/redux/features/api/apiSlice'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Account, Address, Collection, NFT, NFTActiveTransaction, PendingCollection, PendingNFT, Pool, ReservePool, Token, UpdatePricePendingNFT } from "@/lib/type";
import API from '@/config/configApi'

export const adminSlice = createApi({
    reducerPath: 'adminSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API.backendUrl}/admin`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        }
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 600,
    tagTypes: ['Account', 'Suspended Token', 'Suspended Pool', 'Suspended Collection', 'Pending Collection', 'NFT Physical Confirm', 'NFT Physical Transaction'],
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
        getSuspendedCollections: builder.query<Collection[], void>({
            query: () => `/collections/suspended`,
            providesTags: ['Suspended Collection']
        }),
        getAcceptPendingCollections: builder.query<PendingCollection[], void>({
            query: () => `/pendingcollections/accepted`,
            providesTags: ['Pending Collection']
        }),
        getWaitingPendingCollections: builder.query<PendingCollection[], void>({
            query: () => `/pendingcollections/waitting`,
            providesTags: ['Pending Collection']
        }),
        getRejectPendingCollections: builder.query<PendingCollection[], void>({
            query: () => `/pendingcollections/rejected`,
            providesTags: ['Pending Collection']
        }),
        getNFTPhysicalNotHas: builder.query<NFT[], void>({
            query: () => `/nfts/nothasphysical`,
            providesTags: ['NFT Physical Confirm']
        }),
        getNFTPhysicalReceiveTransaction: builder.query<NFTActiveTransaction[], void>({
            query: () => `/transactions/nftphysical/receive`,
            providesTags: ['NFT Physical Transaction']
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
        createPool: builder.mutation<Pool, Partial<Pool>>({
            query: (data) => ({
                url: '/create/pool',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Suspended Pool'],
        }),
        updateReserves: builder.mutation<ReservePool[], void>({
            query: () => ({
                url: '/update/reserves',
                method: 'POST',
            }),
        }),

        //Collection
        updateCollections: builder.mutation<Pool[], void>({
            query: () => ({
                url: '/update/collections',
                method: 'POST',
            }),
            invalidatesTags: ['Suspended Collection'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Collection']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        deleteCollection: builder.mutation<Collection, { _id: string }>({
            query: (data) => ({
                url: '/delete/collection',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Suspended Collection'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Collection']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        activeCollection: builder.mutation<Collection, { _id: string }>({
            query: (data) => ({
                url: '/active/collection',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Suspended Collection'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Collection']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),
        updateNFTs: builder.mutation<NFT[], void>({
            query: () => ({
                url: '/update/nfts',
                method: 'POST',
            }),
            invalidatesTags: ['Suspended Collection'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['Collection']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
        }),

        //Pending Collection
        rejectPendingCollection: builder.mutation<PendingCollection, { _id: string }>({
            query: (data) => ({
                url: '/reject/pendingcollection',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Pending Collection'],
        }),
        acceptPendingCollection: builder.mutation<PendingCollection, { _id: string }>({
            query: (data) => ({
                url: '/accept/pendingcollection',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Pending Collection'],
        }),
        waittingPendingCollection: builder.mutation<PendingCollection, { _id: string }>({
            query: (data) => ({
                url: '/wait/pendingcollection',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Pending Collection'],
        }),

        //Pending NFT
        updatePricePendingNFT: builder.mutation<PendingNFT, UpdatePricePendingNFT[]>({
            query: (data) => ({
                url: '/updateprice/pendingnft',
                method: 'PATCH',
                body: data
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags(['PendingNFTCollection']));
                } catch (err) {
                    console.error('Error invalidating tags:', err);
                }
            }
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

        mintCollection: builder.mutation<PendingCollection, { _id: string }>({
            query: (data) => ({
                url: '/mint/pendingcollection',
                method: 'POST',
                body: data
            }),
        }),

        confirmSendPhysicalNFT: builder.mutation<void, { _id: string }>({
            query: (data) => ({
                url: '/nfts/physical/confirm',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['NFT Physical Confirm']
        }),
        confirmOrderDone: builder.mutation<void, { _id: string }>({
            query: (data) => ({
                url: '/transaction/nftphysical/confirm',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['NFT Physical Transaction']
        }),

    })
})


export const {
    useGetAccountsQuery,
    useGetSuspendedTokensQuery,
    useGetSuspendedPoolsQuery,
    useGetSuspendedCollectionsQuery,
    useGetAcceptPendingCollectionsQuery,
    useGetRejectPendingCollectionsQuery,
    useGetWaitingPendingCollectionsQuery,
    useGetNFTPhysicalNotHasQuery,
    useGetNFTPhysicalReceiveTransactionQuery,

    useUpdateTokensMutation,
    useDeleteTokenMutation,
    useActiveTokenMutation,
    useCreateTokenMutation,
    useAddTokenMutation,

    useUpdatePoolsMutation,
    useDeletePoolMutation,
    useActivePoolMutation,
    useCreatePoolMutation,

    useUpdateCollectionsMutation,
    useDeleteCollectionMutation,
    useActiveCollectionMutation,
    useUpdateNFTsMutation,
    useUpdatePricePendingNFTMutation,

    useAcceptPendingCollectionMutation,
    useRejectPendingCollectionMutation,
    useWaittingPendingCollectionMutation,

    useUpdateReservesMutation,
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,

    useMintCollectionMutation,
    useConfirmSendPhysicalNFTMutation,
    useConfirmOrderDoneMutation
} = adminSlice