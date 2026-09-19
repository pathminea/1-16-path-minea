import {api} from "./api"

export interface User {
id: string,
name: string,
email: string
}

export interface CreateUserRequest {
    name: string,
    email: string
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => "/user",
            providesTags: ["User"],
        }),
        getUser: builder.query<User, string>({
                        query : (id) => `/user/${id}`,
                        providesTags : (_result, _error, id) =>[
              {  type: "User", id},
            ] ,
                }),
        createUser: builder.mutation<User, CreateUserRequest>({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"]
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
            url: `/user/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["User"],
        })
    }),

})
 export const {
    useGetUserQuery,
    useGetUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation
 } = userApi