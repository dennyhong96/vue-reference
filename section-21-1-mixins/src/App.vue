<template>
  <div id="app">
    <div class="scrollPosition">{{ offset }}</div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import myMixin from "@/mixins";

export default defineComponent({
  name: "App",

  // Mixins are merged into options
  mixins: [myMixin],

  // If a piece of data in component instance conflit with a piece of data in mixin,
  // the piece of data in mixin will not get merged in
  data() {
    return {
      offset: 5,
    };
  },

  // Same lifecycle hooks in component instance and mixin both run
  mounted() {
    console.log("mounted lifecycle hook from component instance ran...");
  },
});
</script>

<style>
#app {
  width: 100%;
  height: 3000px;
  position: relative;
}

.scrollPosition {
  position: fixed;
  left: 10px;
  right: 10px;
}
</style>
