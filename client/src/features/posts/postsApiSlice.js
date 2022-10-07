import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});//sorting from more recent to oldest

const initialState = postsAdapter.getInitialState();

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => ({
                url: '/posts',
                 //because isError may be true even if status is 200, from redux doc
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            //mapping _id to id
            transformResponse: responseData => {
                const loadedPosts = responseData.map(user => {
                    user.id = user._id;
                    return user;
                });
                return postsAdapter.setAll(initialState, loadedPosts)//normalizing data through EntityAdapter
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
            query: data => ({
                url: '/posts',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: data => ({
                url: '/posts',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id, imageUrl }) => ({
                url: `/posts`,
                method: 'DELETE',
                body: { id, imageUrl }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        updateLikes: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'PATCH',
                body: {...initialPost}
            }),
            //optimistic update for likes
            async onQueryStarted({ id, likes }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch(
                    postsApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.entities[id]
                        if (post) post.likes = likes
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    }),
});

export const {
    useGetPostsQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useUpdateLikesMutation,
} = postsApiSlice;

// returns the query entire result object
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

// creates memoized selector with result data
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state or initial state if null
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);