'use client'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    Token, TokenBalancesType, Pool, ReservePool,
    NFT, Address, Collection, LiquidBalancesType,
    TokenTransaction, LiquidityTransaction, NFTTransaction,
    ActivesType, TokenActiveTransaction, PoolTransactionsType,
    TokenPrice, NFTActiveTransaction, CollectionTop, Volume, TVL, Order
} from "@/lib/type";
import { getSocket, wsGeneral } from '@/services/socket/createSocket'
import { Socket } from "socket.io-client";

const ws: Socket = wsGeneral
export let wss: Socket | undefined

export const getWss = async () => {
    wss = await getSocket()
}

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_API}/api` }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 600,
    tagTypes: ['TokenBalance', 'LiquidityBalance', "PoolInfo", 'NFTCollection'],
    endpoints: (builder) => ({
        getTokens: builder.query<Token[], void>({
            query: () => '/tokenprices',
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            const token = draft.find(item => item._id === event.data.token_id);
                            if (token) {
                                token.price = event.data.price
                            }
                        })
                    }
                    ws.on('updateTokenPrices', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getPools: builder.query<Pool[], void>({
            query: () => '/pools',
            providesTags: ['PoolInfo']
        }),
        getCollections: builder.query<Collection[], void>({
            query: () => '/collections',
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            const collection = draft.find(item => item._id === event.data._id);
                            if (collection) {
                                collection.floor_price = event.data.floor_price
                                collection.highest_price = event.data.highest_price
                                collection.total_items = event.data.total_items
                                collection.total_listed = event.data.total_listed
                                collection.total_owners = event.data.total_owners
                                collection.volume = event.data.volume
                            }
                        })
                    }
                    ws.on('updateCollection', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
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
        getNFTByCollection: builder.query<NFT[], string>({
            query: (id) => `/nfts/${id}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            const nft = draft.find(item => item._id === event.data._id)
                            if (nft) {
                                nft.owner = event.data.owner
                                nft.price = event.data.price
                                nft.formatted = event.data.formatted
                                nft.isListed = event.data.isListed
                            }
                        })
                    }
                    ws.on('updateNft', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getNFTItem: builder.query<NFT, { collectionId: string, nftId: string }>({
            query: ({ collectionId, nftId }) => `/nft?collection=${collectionId}&nft=${nftId}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            if (draft._id === event.data._id) {
                                draft.owner = event.data.owner
                                draft.price = event.data.price
                                draft.formatted = event.data.formatted
                                draft.isListed = event.data.isListed
                            }
                        })
                    }
                    ws.on('updateNft', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getTokenBalances: builder.query<TokenBalancesType[], Address>({
            query: (address) => `/tokenbalances?address=${address}`,
            providesTags: ['TokenBalance']
        }),
        getLiquidityBalances: builder.query<LiquidBalancesType[], Address>({
            query: (address) => `/liquiditybalances?address=${address}`,
            providesTags: ['LiquidityBalance']
        }),
        getNFTBalances: builder.query<NFT[], Address>({
            query: (address) => `/nftbalances?address=${address}`,
            providesTags: ['NFTCollection']
        }),
        getActives: builder.query<ActivesType[], Address>({
            query: (address) => `/actives/${address}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
                try {
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        updateCachedData((draft) => {
                            const index = draft.findIndex(item => item._id === event.data._id);
                            if (index === -1) {
                                draft.unshift(event.data);
                            } else {
                                draft[index] = event.data;
                            }
                        })
                        dispatch(apiSlice.util.invalidateTags(['TokenBalance']));
                    }
                    wss?.on('updateActiveTransactions', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getTokenTransactionsAll: builder.query<TokenActiveTransaction[], void>({
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
        getTokenTransactions: builder.query<TokenActiveTransaction[], string>({
            query: (id) => `/transactions/tokens/${id}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    const id = arg
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        if ([event.data.from_token_id._id, event.data.to_token_id._id].includes(id)) {
                            updateCachedData((draft) => {
                                draft.unshift(event.data)
                            })
                        }
                    }
                    ws.on('updateTokenTransactions', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getTokenPrices: builder.query<TokenPrice[], string>({
            query: (id) => `/tokenprices/${id}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    const id = arg
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        if (event.data.token_id === id) {
                            updateCachedData((draft) => {
                                draft.push(event.data)
                            })
                        }
                    }
                    ws.on('updateTokenPrices', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getPoolReservePrices: builder.query<ReservePool[], string>({
            query: (id) => `/reserves/${id}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    const id = arg
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        if (event.data.pool_id === id) {
                            updateCachedData((draft) => {
                                draft.push(event.data)
                            })
                        }
                    }
                    ws.on('updateReserves', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getPoolTransactions: builder.query<PoolTransactionsType[], string>({
            query: (id) => `/transactions/pools/${id}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    const id = arg
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        if (event.data.pool_id === id) {
                            updateCachedData((draft) => {
                                draft.unshift(event.data)
                            })
                        }
                    }
                    ws.on('updatePoolTransactions', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getNFTTransactionsByItem: builder.query<NFTActiveTransaction[], { collectionId: string, nftId: string }>({
            query: ({ collectionId, nftId }) => `/transactions/nfts/nft?collection=${collectionId}&nft=${nftId}`,
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    const { collectionId, nftId } = arg
                    await cacheDataLoaded
                    const listener = (event: MessageEvent) => {
                        console.log(event.data)
                        if (collectionId === event.data.collection_id._id && nftId === event.data.nft_id) {
                            updateCachedData((draft) => {
                                draft.unshift(event.data)
                            })
                        }
                    }
                    ws.on('updateNFTItemTransactions', listener)
                } catch (error) {
                    console.log(error)
                }
                await cacheEntryRemoved
            }
        }),
        getSearch: builder.query<{ tokens: Token[]; nfts: Collection[] }, string>({
            query: (query) => `/search?_sort=true&column=name&type=asc&q=${query}`
        }),
        getTopCollections: builder.query<CollectionTop[], void>({
            query: () => `/collections/top`
        }),
        getDailyVolume: builder.query<Volume[], void>({
            query: () => `/transactions/dailyvolume`
        }),
        getDailyTVL: builder.query<TVL[], void>({
            query: () => `/transactions/dailytvl`
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
            }),
            invalidatesTags: ['TokenBalance', 'PoolInfo', 'NFTCollection']
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
            }),
            invalidatesTags: ['TokenBalance', 'LiquidityBalance', 'PoolInfo']
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
            }),
            invalidatesTags: ['TokenBalance', 'NFTCollection']
        }),
        addOrder: builder.mutation<Order, Order>({
            query: (data) => ({
                url: '/addorder',
                method: 'POST',
                body: data
            })
        }),
        updateOrder: builder.mutation<Order, Partial<Order>>({
            query: (data) => ({
                url: `/updateorder`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['TokenBalance']
        }),
        cancelOrder: builder.mutation<Order, Partial<Order>>({
            query: (data) => ({
                url: `/cancelorder`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['TokenBalance']
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
    useGetNFTBalancesQuery,
    useGetActivesQuery,
    useGetTokenTransactionsAllQuery,
    useGetPoolTransactionsQuery,
    useGetNFTTransactionsByItemQuery,
    useGetSearchQuery,
    useGetTokenTransactionsQuery,
    useGetTokenPricesQuery,
    useGetPoolReservePricesQuery,
    useGetNFTByCollectionQuery,
    useGetNFTItemQuery,
    useGetTopCollectionsQuery,
    useGetDailyVolumeQuery,
    useGetDailyTVLQuery,

    useAddTokenTransactionMutation,
    useUpdateTokenTransactionMutation,
    useAddLiquidityTransactionMutation,
    useUpdateLiquidityTransactionMutation,
    useAddNftTransactionMutation,
    useUpdateNftTransactionMutation,
    useAddOrderMutation,
    useUpdateOrderMutation,
    useCancelOrderMutation
} = apiSlice