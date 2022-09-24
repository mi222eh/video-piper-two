import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    createMainDir,
    getAppDir,
    getDataDir,
    getMainDataDir,
    getPublicDir,
    getResourceDir,
} from "../Services/folders.services";

interface IFolderContext {
    mainDir: string;
    appDir: string;
    resourceDir: string;
}

const FolderContext = createContext({} as IFolderContext);

export const useMainDir = () => {
    const { mainDir } = useFolderContext();
    return mainDir;
};
export const useResourceDir = () => {
    const { resourceDir } = useFolderContext();
    return resourceDir;
};

export const useFolderContext = () => {
    return useContext(FolderContext);
};

export function FolderContextProvider(props: { children: ReactNode }) {
    const [mainDir, setMainDir] = useState("");
    const [appDirState, setappDir] = useState("");
    const [dataDirState, setDataDir] = useState("");
    const [publicDirState, setPublicDirState] = useState("");
    const [publicStaticDirState, setStaticDirState] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setStaticDirState(await getResourceDir());
            setMainDir(await getMainDataDir());
            setappDir(await getAppDir());
            setDataDir(await getDataDir());
            setPublicDirState(await getPublicDir());

            await createMainDir();

            setLoading(false);
        })();
    }, []);

    return (
        <FolderContext.Provider
            value={{
                mainDir,
                appDir: appDirState,
                resourceDir: publicStaticDirState,
            }}
        >
            {/* <div className={styles.box}>
                <div>MainDir: {mainDir}</div>
                <div>AppDir: {appDirState}</div>
                <div>DataDir: {dataDirState}</div>
                <div>PublicDir: {publicDirState}</div>
                <div>publicStaticDirState: {publicStaticDirState}</div>
            </div> */}
            {props.children}
        </FolderContext.Provider>
    );
}
