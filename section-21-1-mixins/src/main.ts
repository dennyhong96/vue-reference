import { createApp } from "vue";

// The template, script, and style blocks are compiled into an JS object
import App from "@/App.vue";
// import Greeting from "@/components/Greeting.vue";

const vm = createApp(App);

// Register a component globally (Hard to optimize)
// Global component can be used anywhere in the vue app
// vm.component("Greeting", Greeting);

vm.mount("#app");
