import { createContext, useContext, useState } from 'react';

type AppContextProps = {
  language: string,
  setLanguage: (lang: string) => void
};

const AppContext = createContext<AppContextProps>(
  {} as AppContextProps
);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<AppContextProps & any> = ({
  children
}) => {
  const [language, setLanguage] = useState<string>('de');
  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: (lang) => setLanguage(lang)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
