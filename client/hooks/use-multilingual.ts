import { useState, useCallback } from "react";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)", nativeName: "English", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", nativeName: "English", flag: "🇬🇧" },
  { code: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ja-JP", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", name: "Mandarin", nativeName: "中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "Cantonese", nativeName: "粵語", flag: "🇭🇰" },
  { code: "ko-KR", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru-RU", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pt-BR", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar-SA", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "tr-TR", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "th-TH", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi-VN", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id-ID", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "pl-PL", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "nl-NL", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
];

export function useMultilingual() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  const updateLanguage = useCallback((language: Language) => {
    setSelectedLanguage(language);
  }, []);

  const getLanguageCode = useCallback((): string => {
    return selectedLanguage.code;
  }, [selectedLanguage]);

  return {
    selectedLanguage,
    updateLanguage,
    getLanguageCode,
    languages: SUPPORTED_LANGUAGES,
  };
}

/**
 * Enhanced multilingual speech recognition
 */
export function useMultilingualSpeech() {
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);

  const setLanguageCode = useCallback((code: string) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (lang) {
      setLanguage(lang);
    }
  }, []);

  return {
    language,
    setLanguage,
    setLanguageCode,
    getLanguageCode: () => language.code,
  };
}
