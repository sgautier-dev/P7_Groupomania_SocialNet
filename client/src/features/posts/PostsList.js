import { useGetPostsQuery } from "./postsApiSlice";
import { useState } from "react";
import Post from "./Post";
import PuffLoader from 'react-spinners/PuffLoader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const PostsList = () => {
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('postsList', {
        pollingInterval: 15000, //re-fetching data every 15s
        refetchOnFocus: true, //re-fetching data if user put focus on an other window and comes back
        refetchOnMountOrArgChange: true //re-fetching data on the component mounting or changing
    });

    const [searchResults, setSearchResults] = useState();

    let content;

    if (isLoading) content = <PuffLoader color={"#FFF"} />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    };

    if (isSuccess) {
        const { ids, entities } = posts;

        if (!searchResults) setSearchResults(ids);//for first render

        const handleSubmit = (e) => e.preventDefault();

        const handleSearchChange = (e) => {
            if (!e.target.value) return setSearchResults(ids);

            const resultsArray = ids.filter(postId => entities[postId].username.toLowerCase().includes(e.target.value) || entities[postId].text.toLowerCase().includes(e.target.value));

            setSearchResults(resultsArray);
        };

        const listContent = searchResults?.length ? searchResults.map(postId => <Post key={postId} postId={postId} />) : <p>Aucune correspondance</p>;

        return (
            <section>
                <form className="search" onSubmit={handleSubmit}>
                    <input
                        className="search__input"
                        type="text"
                        placeholder="Rechercher"
                        id="search"
                        onChange={handleSearchChange}
                    />
                    <button className="search__button">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>
                {listContent}
            </section>
        );
    };

    return content;

};

export default PostsList;