import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    //setting authorization header with current token
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        };
        return headers;//applied to every req sent
    }
});

//setting refresh token in status 403
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // args // request url, method, body
    // api // signal, dispatch, getState()
    // extraOptions //if needed custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        console.log('sending refresh token');

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (refreshResult?.data) {

            // store the new access token 
            api.dispatch(setCredentials({ ...refreshResult.data }));

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Votre sessions a expirée. "
            }
            return refreshResult
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
});