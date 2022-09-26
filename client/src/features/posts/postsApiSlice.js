import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt)
});//sorting from more recent to oldest

const initialState = postsAdapter.getInitialState();

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            //because isError may be true even if status is 200, from redux doc
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            //mapping _id to id
            transformResponse: responseData => {
                const loadedPosts = responseData.map(user => {
                    user.id = user._id;
                    return user;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            
            providesTags: (result, error, arg) => {
                //safe guard if query returns no ids
                if (result?.ids) {
                    return [
                        { type: 'Post', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Post', id }))
                    ]
                } else return [{ type: 'Post', id: 'LIST' }]
            }
        }),

        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'PATCH',
                body: {
                    ...initialPost,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
    }),
});

export const {
    useGetPostsQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApiSlice;

// returns the query result object
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);