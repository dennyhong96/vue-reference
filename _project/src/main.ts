import { createApp, App as TApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import store, { storeKey } from "@/store";
import i18n from "@/includes/i18n";
import VeeValidatePlugin from "@/includes/validation";
import registerGlobalComponentsPlugin from "@/includes/_globals";
import { auth } from "@/includes/firebase";
import createProgressBar from "@/includes/progressBar";
import iconDirective from "@/directives/icon";
import clickOutside from "@/directives/clickOutside";
import "@/assets/tailwind.css";
import "@/assets/main.css";
import "nprogress/nprogress.css";
import "@/registerServiceWorker";

// route change progress bar
createProgressBar(router);

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
  app.use(registerGlobalComponentsPlugin);

  // Directives
  app.directive("icon", iconDirective);
  app.directive("click-outside", clickOutside);

  // Globle Error Handler
  app.config.errorHandler = (error) => {
    console.error("app.config.errorHandler", error);
  };

  app.mount("#app");
});

// Render function
// import {
//   createApp,
//   h,
//   resolveDynamicComponent,
//   withDirectives,
//   // Default Components
//   KeepAlive,
//   Transition,
//   TransitionGroup,
//   Teleport
// } from "vue";

// const testDirective = (el, binding) => {
//   console.log({ el });
//   console.log({ binding });
// };

// const MyInput = {
//   props: {
//     modelValue: {
//       type: String,
//       required: true
//     }
//   },
//   emits: ["update:modelValue"],
//   render() {
//     return h("input", {
//       value: this.modelValue,
//       onInput: (evt) => this.$emit("update:modelValue", evt.target.value)
//     });
//   }
// };

// const MyHeading = {
//   data() {
//     return {
//       name: "Denny"
//     };
//   },
//   render() {
//     return withDirectives(
//       h(
//         "h1",
//         this.$slots.default({
//           name: this.name
//         })
//       ),
//       [[testDirective, 200, "top", { animate: true }]]
//     );
//   }
// };

// const app = createApp({
//   data() {
//     return {
//       modelValue: ""
//     };
//   },
//   render() {
//     const Input = resolveDynamicComponent(MyInput);
//     return [
//       h(Input, {
//         modelValue: this.modelValue,
//         "onUpdate:modelValue": (newValue) => (this.modelValue = newValue)
//       }),
//       h(
//         Transition,
//         {
//           mode: "out-in",
//           name: "heading"
//         },
//         this.modelValue.length > 7
//           ? h(MyHeading, null, {
//               default: ({ name }) => h("span", `${name} - ${this.modelValue}`)
//             })
//           : ""
//       )
//     ];
//   }
// });

// app.directive({
//   test: {
//     mounted(el) {
//       console.log({ el });
//     }
//   }
// });

// app.mount("#app");
