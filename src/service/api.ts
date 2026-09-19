
import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"


export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBlIC_API_URL,
    }),
    tagTypes: [
        "User",
        "Product",
    ],
    endpoints: () => ({}),
})