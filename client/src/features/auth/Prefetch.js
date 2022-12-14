import { store } from '../../app/store';
import { postsApiSlice } from '../posts/postsApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

//manually creating posts and users subscribitions that will persist during all the protected pages time. To workaround default Redux keepUnUsedData of 60s expire from cache and help state persistance if user refresh browser, we unsubscribe when leaving the protected pages.
const Prefetch = () => {
    useEffect(() => {
        // console.log('subscribing')
        const posts = store.dispatch(postsApiSlice.endpoints.getPosts.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            // console.log('unsubscribing')
            posts.unsubscribe()
            users.unsubscribe()
        }
    }, []);

    return <Outlet />;
};
export default Prefetch;