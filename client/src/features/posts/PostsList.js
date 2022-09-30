import { useGetPostsQuery } from "./postsApiSlice";
import Post from "./Post";
import PuffLoader from 'react-spinners/PuffLoader';

const PostsList = () => {
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('postsList', {
        pollingInterval: 15000, //re-fetching data every 15s
        refetchOnFocus: true, //re-fetching data if user put focus on an other window
        refetchOnMountOrArgChange: true //re-fetching data on the component mounting or changing
    });

    let content;

    if (isLoading) content = <PuffLoader color={"#FFF"} />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    };

    if (isSuccess) {
        const { ids } = posts;

        const listContent = ids?.length && ids.map(postId => <Post key={postId} postId={postId} />);

        return (
            <section>
                {listContent}
            </section>
        );
    };

    return content;

};

export default PostsList;