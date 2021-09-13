import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "@/assets/tailwind.css";
import "@/assets/main.css";
import "@/registerServiceWorker";

const app = createApp(App);

// plugins must be used before mounting the app
app.use(store);
app.use(router);

app.mount("#app");
