import { createApp, App as TApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import store, { storeKey } from "@/store";
import i18n from "@/includes/i18n";
import VeeValidatePlugin from "@/includes/validation";
import globalComponentsPlugin from "@/includes/_globals";
import progressBar from "@/includes/progressBar";
import { auth } from "@/includes/firebase";
import iconDirective from "@/directives/icon";
import "@/assets/tailwind.css";
import "@/assets/main.css";
import "nprogress/nprogress.css";
import "@/registerServiceWorker";

// route change progress bar
progressBar(router);

let app: TApp<Element>;

auth.onAuthStateChanged(() => {
  // Load the vue app after auth state change, so we could grab auth.currentUser to check for if a user is logged in
  console.log("onAuthStateChanged");

  if (app) return;

  app = createApp(App);
  console.log("createApp(App)");

  // plugins must be used before mounting the app
  app.use(store, storeKey);
  app.use(router);
  app.use(VeeValidatePlugin, { foo: 5 });
  app.use(i18n);

  // Automatically register common components globally
  app.use(globalComponentsPlugin);

  // Directives
  app.directive("icon", iconDirective);

  app.mount("#app");
});
