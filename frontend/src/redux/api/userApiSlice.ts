import { USER_URL } from "../constraints";
import apiSlice from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        createUser : builder.mutation({
            query : (data)=>({
                url : `${USER_URL}`,
                method : "POST",
                body : data
            })
        }),
        login : builder.mutation({
            query : (data)=>({
                url :`${USER_URL}/login`,
                method : "POST",
                body : data
            })
        }),
        logout : builder.mutation({
            query : ()=>({
                url : `${USER_URL}/logout`,
                method : "POST"
            })
        }),
        getUser : builder.query({
            query : (id)=>({
                url : `${USER_URL}/${id}`,
                method : "GET"
            })
        }),
        getUsers : builder.query({
            query : ()=>({
                url : `${USER_URL}`,
                method : 'GET'
            })
        }),
        updateUser : builder.mutation({
            query : ({id,data})=>({
                url : `${USER_URL}/${id}`,
                method : "PUT",
                body : data
            })
        }),
        deleteUser : builder.mutation({
            query : (id)=>({
                url : `${USER_URL}/${id}`,
                method : "DELETE"
            })
        }),
        updateUserByAdmin : builder.mutation({
            query : ({id,data})=>({
                url : `${USER_URL}/admin/${id}`,
                method : "PUT",
                body : data
            })
        })
    })
})

export const {useCreateUserMutation,useDeleteUserMutation,useGetUserQuery,useGetUsersQuery,useLoginMutation,useLogoutMutation,useUpdateUserMutation,useUpdateUserByAdminMutation} = userApiSlice