<template>
  <h1>Home</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    console.log("Home is mounted");
  },
  activated() {
    console.log("Home is activated");
  },
  unmounted() {
    console.log("Home is unmounted");
  },
  deactivated() {
    console.log("Home is deactivated");
  },
});
</script>
