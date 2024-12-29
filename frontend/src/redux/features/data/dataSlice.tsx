'use client'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Collection } from "@/lib/type";

export const dataSlice = createApi({
    reducerPath: 'dataSlice',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_API ? process.env.NEXT_PUBLIC_BACKEND_API : "http://localhost"}/pay` }),
    endpoints: (builder) => ({
        getJsonData: builder.query<Collection, string>({
            query: (url) => url,

        })
    })
})

export const {
    useGetJsonDataQuery,

} = dataSlice