import { FC, createContext, useState, useEffect, useCallback } from "react";

type AppContextProps = {
    apiConnected: boolean;
    apiName: string;
    setApiName: Function;
    checkApi: Function;
    pageLoaded: boolean;
    setPageLoaded: Function;
};

const AppContext = createContext<AppContextProps>({
    apiConnected: false,
    apiName: "",
    setApiName: () => {},
    checkApi: () => {},
    pageLoaded: false,
    setPageLoaded: () => {},
});

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [apiConnected, setApiConnected] = useState<boolean>(false);
    const [apiName, setApiName] = useState<string>();
    const [pageLoaded, setPageLoaded] = useState(false);

    const checkApi = useCallback(() => {
        fetch("/api/hello")
            .then((resp) => resp.json())
            .then((data) => {
                setApiConnected(!!data);
                setPageLoaded(true);
            })
            .catch((err) => {
                setApiConnected(false);
                setPageLoaded(true);
            });
    }, []);

    const contextValue = {
        apiConnected,
        apiName,
        setApiName,
        checkApi,
        pageLoaded,
        setPageLoaded,
    };

    useEffect(checkApi, []);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
