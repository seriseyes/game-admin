/**
 * Cookie-г нэрээр нь авах hook
 *
 * Баярхүү.Лув, 2022.01.28 14:07
 */
import {useEffect, useState} from "react";

const useCookie = (name: string) => {
    const state = document.cookie;
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        state.split(";").forEach(el => {
            if (el.includes(name)) {
                setValue(el.split("=")[1]);
            }
        });
    }, [value, setValue]);


    return value;
}
export default useCookie;
