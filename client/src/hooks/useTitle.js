import { useEffect } from "react";

const useTitle = (title) => {
    //setting page title, then back to original title with cleanup func
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;

        return () => document.title = prevTitle;
    }, [title]);

};

export default useTitle;