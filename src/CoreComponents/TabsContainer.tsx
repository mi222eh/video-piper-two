import { Tab, Tabs, TabsProps } from "@mui/material";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Link,
    matchPath,
    NavLink,
    resolvePath,
    useLocation,
    useResolvedPath,
} from "react-router-dom";

interface ITabContainerContext {
    addValue(value: string): void;
    removeValue(value: string): void;
}

/**
 * A context that allows tabs to register themselves with the container
 */
const context = createContext({} as ITabContainerContext);

/**
 * A tab container that is used in the main menu
 */
export function TabsContainerMainMenu(props: TabsProps) {
    return (
        <TabsContainerBase
            sx={(theme) => ({
                "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.text.primary,
                },
            })}
            {...props}
        ></TabsContainerBase>
    );
}

export function TabsContainerVertical(props: TabsProps) {
    return (
        <TabsContainerBase
            sx={(theme) => ({
                "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.text.primary,
                },
                backgroundColor: theme.palette.background.default,
                height: "100%",
                borderRight: `1px solid ${theme.palette.divider}`,
            })}
            orientation="vertical"
            {...props}
        ></TabsContainerBase>
    );
}

/**
 * A tab that will be added to the parent TabsContainer
 * @param props The props for the tab component
 * @returns The tab component
 *
 */
export function TabItem(props: { value: string; label: string; to: string }) {
    const { addValue, removeValue } = useContext(context);
    useEffect(() => {
        addValue(props.value);
        return () => removeValue(props.value);
    }, [addValue, removeValue, props.value]);
    return (
        <Tab
            value={props.value}
            label={props.label}
            to={props.to}
            component={NavLink}
        />
    );
}

function useUrlMatch(valueList: string[]) {
    // Use resolved path to get the current value, and then check if it's in the list
    const url = useResolvedPath(":item");
    const base = useResolvedPath("");
    const currentUrl = useLocation().pathname;
    return useMemo(() => {
        return (
            valueList.find((v) => {
                const path = resolvePath(v, base.pathname);
                const match = matchPath(path.pathname, currentUrl);
                return match != null;
            }) ?? false
        );
    }, [url, valueList]);
}

/**
 * A tab container that can be used to switch between different views
 */
const TabsContainerBase = (props: TabsProps) => {
    const url = useResolvedPath(":item");
    const [values, setValues] = useState<string[]>([]);
    const addValue = useCallback((value: string) => {
        setValues((values) => [...values, value]);
    }, []);
    const removeValue = useCallback((value: string) => {
        setValues((values) => values.filter((v) => v !== value));
    }, []);
    const contextValue = useMemo(
        () => ({ addValue, removeValue }),
        [addValue, removeValue]
    );
    const value = useUrlMatch(values);
    return (
        <context.Provider value={contextValue}>
            <Tabs value={value} {...props}></Tabs>
        </context.Provider>
    );
};
