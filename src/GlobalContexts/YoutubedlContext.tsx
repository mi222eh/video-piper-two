import { createContext, ReactNode, useEffect, useState } from "react";
import { IVideoInfo } from "../VideoInfo";
import { executeYoutubeDlCommand } from "../Services/youtubedl.services";

interface IyoutubeDlContext {}

const youtubeDlContext = createContext({} as IyoutubeDlContext);

export const useVideoInfo = (url: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState<IVideoInfo | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setData(null);
        executeYoutubeDlCommand(["-J", url])
            .then((x) => {
                console.log(x);
                setData(JSON.parse(x));
            })
            .catch((x) => {
                console.error(x);
                setError(x);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url]);

    return { loading, error, data };
};

export function YoutubeDlContextProvider(props: { children: ReactNode }) {
    return (
        <youtubeDlContext.Provider value={{}}>
            {props.children}
        </youtubeDlContext.Provider>
    );
}
