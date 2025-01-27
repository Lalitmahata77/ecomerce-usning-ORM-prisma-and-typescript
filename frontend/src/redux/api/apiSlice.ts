import {fetchBaseQuery,createApi} from "@reduxjs/toolkit/query/react"
import { BASEURL } from "../constraints"

const baseQuery = fetchBaseQuery({baseUrl : BASEURL})


const apiSlice = createApi({
    baseQuery,
    endpoints : ()=>({})
})

export default  apiSlice