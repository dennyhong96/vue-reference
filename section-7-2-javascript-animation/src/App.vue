<template>
  <button @click="flag = !flag">Toggle Animation</button>

  <!-- <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @enter-cancelled="enterCancelled"
    @leave-cancelled="leaveCancelled"
  >
    <h2 v-if="flag">Hello, World!</h2>
  </transition> -->

  <!-- :css="false" tells vue not to check if we declared css animation, because vue prefers css animation -->
  <transition
    :css="false"
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
    },
    enter(el: HTMLElement, done: () => void) {
      console.log("enter", el);

      // Web Animation API
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
      const animation = el.animate([{ transform: "scale3d(0,0,0)" }, {}], {
        duration: 500,
      });
      animation.onfinish = () => done(); // Must call done() to proceed
    },
    afterEnter(el: HTMLElement) {
      console.log("afterEnter", el);
    },

    beforeLeave(el: HTMLElement) {
      console.log("beforeLeave", el);
    },
    leave(el: HTMLElement, done: () => void) {
      console.log("leave", el);

      const animation = el.animate([{}, { transform: "scale3d(0,0,0)" }], {
        duration: 500,
      });
      animation.onfinish = () => done(); // Must call done() to proceed
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
</style>
