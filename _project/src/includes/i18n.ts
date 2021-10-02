import { createI18n, LocaleMessages, VueMessageType } from "vue-i18n";

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages(): LocaleMessages<VueMessageType> {
  // require.context() scans a directory for matching files, Webpack injects it automatically
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );

  const messages: LocaleMessages<VueMessageType> = {};

  console.log(locales.keys());

  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default ?? locales(key);
    }
  });

  return messages;
}

export default createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),

  // Numeric translations require a differnt structure, can't reside in .json files
  // Can outsource this to another file
  numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
    fr: {
      currency: {
        style: "currency",
        currency: "EUR",
      },
    },
    zh: {
      currency: {
        style: "currency",
        currency: "RMB",
      },
    },
  },
});
