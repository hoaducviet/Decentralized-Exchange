'use client'

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    Token, TokenBalancesType,
    Pool, ReservePool,
    NFT, Address,
    Collection, CollectionItem,
    GetCollection, LiquidBalancesType,
    TokenTransaction, LiquidityTransaction,
    NFTTransaction, ActivesType, TokenActiveTransaction,
    LiquidityActiveTransaction
} from "@/lib/type";
import { getSocket, wsGeneral } from '@/services/socket/createSocket'
import { Socket } from "socket.io-client";

const ws: Socket = wsGeneral
let wss: Socket

export const getWss = () => {
    wss = getSocket()
}

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
        getReserves: builder.query<ReservePool[], void>({
            query: () => '/reserves',
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            const reserve = draft.find(item => item.pool_id === event.data.pool_id);
                            if (reserve) {
                                reserve.reserve1 = event.data.reserve1
                                reserve.reserve2 = event.data.reserve2
                            }
                        })
                    }
                    ws.on('updateReserves', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
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
        getActives: builder.query<ActivesType[], Address>({
            query: (address) => `/actives/${address}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        console.log(event.data)
                        updateCachedData((draft) => {
                            const index = draft.findIndex(item => item._id === event.data._id);
                            if (index === -1) {
                                draft.unshift(event.data);
                            } else {
                                draft[index] = event.data;
                            }
                        })
                    }
                    wss.on('updateActiveTransactions', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getTokenTransactionAll: builder.query<TokenActiveTransaction[], void>({
            query: () => '/transactions/tokens',
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            draft.unshift(event.data)
                        })
                    }
                    ws.on('updateTokenTransactions', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getPoolTransactionByAddress: builder.query<LiquidityActiveTransaction[], Address>({
            query: (address) => `/transactions/pools/${address}`,

        }),
        getSearch: builder.query<{ tokens: Token[]; nfts: Collection[] }, string>({
            query: (query) => `/search?_sort=true&column=name&type=asc&q=${query}`
        }),


        //Mutations
        addTokenTransaction: builder.mutation<TokenTransaction, TokenTransaction>({
            query: (data) => ({
                url: '/addtransaction/token',
                method: 'POST',
                body: data
            })
        }),
        updateTokenTransaction: builder.mutation<TokenTransaction, Partial<TokenTransaction>>({
            query: (data) => ({
                url: `/updatetransaction/token`,
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
        updateLiquidityTransaction: builder.mutation<LiquidityTransaction, Partial<LiquidityTransaction>>({
            query: (data) => ({
                url: `/updatetransaction/liquidity`,
                method: 'PATCH',
                body: data
            })
        }),

        addNftTransaction: builder.mutation<NFTTransaction, NFTTransaction>({
            query: (data) => ({
                url: '/addtransaction/nft',
                method: 'POST',
                body: data
            })
        }),
        updateNftTransaction: builder.mutation<NFTTransaction, Partial<NFTTransaction>>({
            query: (data) => ({
                url: `/updatetransaction/nft`,
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
    useGetReservesQuery,
    useGetLiquidityBalancesQuery,
    useGetCollectionsQuery,
    useGetCollectionQuery,
    useGetNFTBalancesQuery,
    useGetActivesQuery,
    useGetTokenTransactionAllQuery,
    useGetPoolTransactionByAddressQuery,
    useGetSearchQuery,

    useAddTokenTransactionMutation,
    useUpdateTokenTransactionMutation,
    useAddLiquidityTransactionMutation,
    useUpdateLiquidityTransactionMutation,
    useAddNftTransactionMutation,
    useUpdateNftTransactionMutation,
} = apiSlice