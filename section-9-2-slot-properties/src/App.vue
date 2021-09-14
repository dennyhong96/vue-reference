<template>
  <div id="app">
    <hello-world v-slot="slotProps">
      <p>Hello, {{ slotProps.user.name }}!</p>
      <p>My favorites - {{ slotProps.favorites }}!</p>
    </hello-world>

    <!-- #default is short hand for v-slot -->
    <!-- Can also destructure properties from the slotProps object -->
    <hello-world #default="{ user, favorites }">
      <p>Hello, {{ user.name }}!</p>
      <p>My favorites - {{ favorites }}!</p>
    </hello-world>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
  },
});
</script>
