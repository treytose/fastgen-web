import { FC, createContext, useState, useEffect, useCallback } from "react";

type AppContextProps = {
  apiConnected: boolean;
  api?: FastgenAPI;
  setAPI: Function;
  checkApi: Function;
  pageLoaded: boolean;
  setPageLoaded: Function;
};

export type FastgenAPI = {
  fastgen_apiid: number;
  name: string;
  path: string;
};

const AppContext = createContext<AppContextProps>({
  apiConnected: false,
  api: undefined,
  setAPI: () => {},
  checkApi: () => {},
  pageLoaded: false,
  setPageLoaded: () => {},
});

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [api, setAPI] = useState<string>();
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
    api,
    setAPI,
    checkApi,
    pageLoaded,
    setPageLoaded,
  };

  useEffect(checkApi, []);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
