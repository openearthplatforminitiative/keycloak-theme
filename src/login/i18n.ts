/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withExtraLanguages({
        /* ... */
    })
    .withCustomTranslations({
        en: {
            loginAccountTitle: "Sign in with your preferred provider",
            pageExpiredMsg1: "Restart the login process",
            pageExpiredMsg2: "Continue the login process",
            backToApplication: "Back to application"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
