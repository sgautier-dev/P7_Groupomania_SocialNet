import { useState, useEffect } from "react";

//setting persist state from localStorage
const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist]);

    return [persist, setPersist];
};
export default usePersist;