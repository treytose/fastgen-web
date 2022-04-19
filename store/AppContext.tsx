import { FC, createContext, useState, useEffect } from "react";

type AppContextProps = {
  apiConnected: boolean;
  path: string;
};

const AppContext = createContext<AppContextProps>({
  apiConnected: false,
  path: "",
});

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const contextValue = {
    apiConnected,
    path: "",
  };

  useEffect(() => {
    fetch("/api/hello")
      .then((resp) => resp.json())
      .then((data) => {
        setApiConnected(!!data);
      })
      .catch((err) => {
        setApiConnected(false);
      });
  }, []);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
