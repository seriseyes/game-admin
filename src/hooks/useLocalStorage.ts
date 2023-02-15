import {useEffect, useState} from "react";

const useLocalStorage = (name: string) => {
    const state = localStorage.getItem(name);
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        setValue(state);
    }, [value, setValue]);


    return value;
}
export default useLocalStorage;
