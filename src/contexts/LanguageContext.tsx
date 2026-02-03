import React, { createContext, useContext, ReactNode } from "react";
import { Language, uiTranslations, UITranslations } from "../i18n/translations";

type LanguageContextType = {
  lang: Language;
  t: UITranslations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  t: uiTranslations.en,
});

type LanguageProviderProps = {
  lang: Language;
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  lang,
  children,
}) => {
  const t = uiTranslations[lang];

  return (
    <LanguageContext.Provider value={{ lang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};

export default LanguageContext;
