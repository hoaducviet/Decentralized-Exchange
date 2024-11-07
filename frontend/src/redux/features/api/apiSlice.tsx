'use client'

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    Token, TokenBalancesType,
    Pool, ReservePool,
    NFT, Address,
    Collection, CollectionItem,
    GetCollection, LiquidBalancesType,
    TokenTransaction, LiquidityTransaction
} from "@/lib/type";

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_API}/api` }),
    endpoints: (builder) => ({
        getTokens: builder.query<Token[], void>({
            query: () => '/tokens'
        }),
        getPools: builder.query<Pool[], void>({
            query: () => '/pools'
        }),
        getCollections: builder.query<Collection[], void>({
            query: () => '/collections'
        }),
        getCollection: builder.query<CollectionItem, GetCollection>({
            query: ({ address, addressCollection }) => `/collection?address=${address}&addressCollection=${addressCollection}`,
        }),
        getTokenBalances: builder.query<TokenBalancesType[], Address>({
            query: (address) => `/tokenbalances?address=${address}`
        }),
        getLiquidityBalances: builder.query<LiquidBalancesType[], Address>({
            query: (address) => `/liquiditybalances?address=${address}`
        }),
        getNFTBalances: builder.query<NFT[], Address>({
            query: (address) => `/nftbalances?address=${address}`
        }),
        getReservePool: builder.query<ReservePool[], void>({
            query: () => '/reservepools'
        }),



        //Mutations
        addTokenTransaction: builder.mutation<TokenTransaction, TokenTransaction>({
            query: (data) => ({
                url: '/addtransaction/token',
                method: 'POST',
                body: data
            })
        }),
        updateTokenTransaction: builder.mutation<TokenTransaction, { id: string, data: Partial<TokenTransaction> }>({
            query: ({ id, data }) => ({
                url: `/updatetransaction/token/${id}`,
                method: 'PATCH',
                body: data
            })
        }),

        addLiquidityTransaction: builder.mutation<LiquidityTransaction, LiquidityTransaction>({
            query: (data) => ({
                url: '/addtransaction/liquidity',
                method: 'POST',
                body: data
            })
        }),
        updateLiquidityTransaction: builder.mutation<LiquidityTransaction, { id: string, data: Partial<LiquidityTransaction> }>({
            query: ({ id, data }) => ({
                url: `/updatetransaction/liquidity/${id}`,
                method: 'PATCH',
                body: data
            })
        }),


        
    })
})


export const {
    useGetTokensQuery,
    useGetTokenBalancesQuery,
    useGetPoolsQuery,
    useGetLiquidityBalancesQuery,
    useGetCollectionsQuery,
    useGetCollectionQuery,
    useGetNFTBalancesQuery,
    useGetReservePoolQuery,
    useAddTokenTransactionMutation,
    useUpdateTokenTransactionMutation,
    useAddLiquidityTransactionMutation,
    useUpdateLiquidityTransactionMutation,
} = apiSlice