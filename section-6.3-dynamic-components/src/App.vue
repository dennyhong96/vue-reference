<template>
  <select v-model="componentName">
    <option value="Home">Home</option>
    <option value="About">About</option>
  </select>

  <!-- keep-alive keeps components alive in the memory between toggle instead of destroying them -->
  <!-- :is value must be the name of a component registered locally -->
  <keep-alive>
    <component :is="componentName"></component>
  </keep-alive>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import About from "@/components/About.vue";
import Home from "@/components/Home.vue";

export default defineComponent({
  name: "App",

  components: {
    About,
    Home,
  },

  data() {
    return {
      componentName: "Home" as "Home" | "About",
    };
  },
});
</script>
