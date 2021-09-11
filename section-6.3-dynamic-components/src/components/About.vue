<template>
  <h1>About</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    console.log("About is mounted");
  },
  activated() {
    console.log("About is activated");
  },
  unmounted() {
    console.log("About is unmounted");
  },
  deactivated() {
    console.log("About is deactivated");
  },
});
</script>
