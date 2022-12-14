import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                //because isError may be true even if status is 200, from redux doc
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            //mapping _id to id as EntityAdapter require id
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id;
                    return user;
                });
                return usersAdapter.setAll(initialState, loadedUsers)//normalizing data with EntityAdapter
            },
            //safe guard if query returns no ids
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        //full List tag and specific user ids tags
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            //forcing LIST cache to update
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        registerUser: builder.mutation({
            query: initialUserData => ({
                url: '/users/signup',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            //forcing LIST cache to update
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            //invalidating only individual user id
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            //invalidating only individual user id
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
});

export const { 
    useGetUsersQuery,
    useAddNewUserMutation,
    useRegisterUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,            
 } = usersApiSlice;

// returns the query entire result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector with result data so only if selectUsersResult changes will re-run the output, for App optimization
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state or initial state if null
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);