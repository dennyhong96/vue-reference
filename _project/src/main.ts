import { createApp, App as TApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import VeeValidatePlugin from "@/includes/validation";
import { auth } from "@/includes/firebase";
import "@/assets/tailwind.css";
import "@/assets/main.css";
import "@/registerServiceWorker";

let app: TApp<Element>;

auth.onAuthStateChanged(() => {
  // Load the vue app after auth state change, so we could grab auth.currentUser to check for if a user is logged in
  console.log("onAuthStateChanged");

  if (app) return;

  app = createApp(App);
  console.log("createApp(App)");

  // plugins must be used before mounting the app
  app.use(store);
  app.use(router);
  app.use(VeeValidatePlugin, { foo: 5 });

  app.mount("#app");
});
