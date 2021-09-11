<template>
  <button @click="flag = !flag">Toggle Animation</button>

  <!-- Using css animation together with javascript animation -->
  <!-- JavaScript can be used to perform side effects that hooks into animation lifecycle -->
  <transition
    :css="true"
    name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <h2 v-if="flag">Hello, World!</h2>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      flag: true,
    };
  },

  methods: {
    beforeEnter(el: HTMLElement) {
      console.log("beforeEnter", el);
      // Side-effects
      // Network request, analytics, etc...
    },
    enter(el: HTMLElement, done: () => void) {
      console.log("enter", el);

      // When using css animation together with js animation, calling done() is optional
      // Do NOT call done() if you want css transition duration to take effect
      // done();
    },
    afterEnter(el: HTMLElement) {
      console.log("afterEnter", el);
    },

    beforeLeave(el: HTMLElement) {
      console.log("beforeLeave", el);
    },
    leave(el: HTMLElement, done: () => void) {
      console.log("leave", el);

      // When using css animation together with js animation, calling done() is optional
      // Do NOT call done() if you want css transition duration to take effect
      // done();
    },
    afterLeave(el: HTMLElement) {
      console.log("afterLeave", el);
    },
  },
});
</script>

<style scoped>
h2 {
  width: max-content;
  will-change: transform;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.975);
}

@media (prefers-reduced-motion: no-preference) {
  .fade-enter-active,
  .fade-leave-active {
    transition: 0.2s ease;
  }
}
</style>
