import { useGetPostsQuery } from "./postsApiSlice";
import Post from "./Post";

const PostsList = () => {
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error
} = useGetPostsQuery(undefined, {
    pollingInterval: 15000, //re-fetching data every 15s
    refetchOnFocus: true, //re-fetching data if user put focus on an other window
    refetchOnMountOrArgChange: true //re-fetching data on the component mounting or changing
});

let content;

if (isLoading) content = <p>En cours de chargement...</p>;

if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
};

if (isSuccess) {
    const { ids } = posts;

    const tableContent = ids?.length
        ? ids.map(postId => <Post key={postId} postId={postId} />)
        : null;

    content = (
        <table className="table table--posts">
            <thead className="table__thead">
                <tr>
                    <th scope="col" className="table__th"></th>
                    <th scope="col" className="table__th post__created">Date de création</th>
                    <th scope="col" className="table__th post__updated">Date de modification</th>
                    <th scope="col" className="table__th post__title">Texte</th>
                    <th scope="col" className="table__th post__username">Créé par</th>
                    <th scope="col" className="table__th post__edit">Editer</th>
                </tr>
            </thead>
            <tbody>
                {tableContent}
            </tbody>
        </table>
    );
};

return content
};

export default PostsList;