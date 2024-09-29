'use client'

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type ApiSlice = {
    value: string,

}

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (builder) => ({
        getDataApi: builder.query<ApiSlice, string>({
            query: (name) => `page/${name}`
        })
    })
})

export const { useGetDataApiQuery } = apiSlice