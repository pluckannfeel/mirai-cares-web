import { Locale } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Map your i18n language codes to the corresponding date-fns locales
const locales: { [key: string]: Locale } = {
  en: enUS, // Note the change here, it's enUS instead of en
  ja: ja,
};

export function useDateLocale(): Locale | undefined {
  const [locale, setLocale] = useState<Locale | undefined>(undefined);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Ensure the i18n language code matches the keys in your locales map
    const newLocale = locales[i18n.language.split('-')[0]]; // Splitting in case of language codes like en-US
    setLocale(newLocale);
  }, [i18n.language]);

  return locale;
}
