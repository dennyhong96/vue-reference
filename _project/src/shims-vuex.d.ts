// vuex.d.ts
import { ComponentCustomProperties } from "vue";
import { AppStore } from "./store";

declare module "@vue/runtime-core" {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: AppStore;
  }
}
