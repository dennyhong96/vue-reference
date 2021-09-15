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
