module.exports = {
  // i18n options
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
    },
  },

  // pwa options
  pwa: {
    // Shortcuts
    name: "Music App",
    themeColor: "#ff5e3a",

    // Provide more options, overwrites shortcuts
    manifestOptions: {
      short_name: "Music",
    },
  },
};
