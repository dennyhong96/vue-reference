<template>
  <button @click="flag = !flag">Toggle Animation</button>

  <!-- Vue prioritize duration than css transition duration -->
  <!-- <transition name="fade" duration="2500">
    <h2 v-if="flag">Hello, World!</h2>
  </transition> -->

  <!-- <transition name="fade">
    <h2 v-show="flag">Hello, World!</h2>
  </transition> -->

  <!-- <transition name="fade" mode="out-in">
    <h2 v-if="flag" key="main">Hello, World!</h2>
    <h2 v-else key="secondary">Another Hello!</h2>
  </transition> -->

  <!-- keyframes animation -->
  <transition name="zoom" type="animation" appear>
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

@keyframes zoom {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .fade-enter-active,
  .fade-leave-active {
    transition: 0.2s ease;
  }

  .zoom-enter-active {
    /* When css animation and transition are used together and have different duration */
    /* you can manually specify a type="animation" | type="transition" on the <transition/> element */
    /* to control which duration vue should use */
    animation: zoom 0.5s;
    transition: all 1s;
  }
  .zoom-leave-active {
    animation: zoom 0.5s reverse;
    transition: all 1s;
  }
}
</style>
