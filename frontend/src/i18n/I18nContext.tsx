import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { translations, type Language } from "@/i18n/translations";

type TranslationParams = Record<
  string,
  string | number
>;

type I18nContextValue = {
  language: Language;
  t: (
    key: string,
    params?: TranslationParams,
  ) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function isSupportedLanguage(value: unknown): value is Language {
  return value === "english" || value === "german";
}

function getNestedValue(source: unknown, path: string): string | undefined {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const result = path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, source);

  return typeof result === "string" ? result : undefined;
}

function interpolate(
  value: string,
  params?: TranslationParams,
) {
  if (!params) {
    return value;
  }

  return Object.entries(params).reduce(
    (text, [key, replacement]) =>
      text.replaceAll(
        `{${key}}`,
        String(replacement),
      ),
    value,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const language: Language = isSupportedLanguage(user?.ai_response_language)
    ? user.ai_response_language
    : "english";

  useEffect(() => {
    document.documentElement.lang = language === "german" ? "de" : "en";
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    function t(
      key: string,
      params?: TranslationParams,
    ) {
      const value =
        getNestedValue(
          translations[language],
          key,
        ) ??
        getNestedValue(
          translations.english,
          key,
        ) ??
        key;

      return interpolate(
        value,
        params,
      );
    }

    return {
      language,
      t,
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}