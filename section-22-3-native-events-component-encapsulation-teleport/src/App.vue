<template>
  <div id="app">
    <Action />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Action from "@/components/Action.vue";

export default defineComponent({
  name: "App",

  components: {
    Action,
  },
});
</script>

<style src="bootstrap/dist/css/bootstrap.css"></style>
