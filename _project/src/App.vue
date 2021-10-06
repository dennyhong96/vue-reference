<template>
  <AppHeader />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <Player />
  <AuthModal />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  provide,
  reactive,
  readonly,
  ref,
  useCssModule,
  watch,

  // watchEffect & aliases
  watchEffect,
  watchPostEffect, // { flush: "post" }
  watchSyncEffect, // { flush: "sync" }
} from "vue";

import AppHeader from "@/components/AppHeader.vue";
import AuthModal from "@/components/AuthModal.vue";
import Player from "@/components/Player.vue";
import useAuth from "@/composables/useAuth";

export default defineComponent({
  name: "App",

  components: {
    AppHeader,
    AuthModal,
    Player,
  },

  setup() {
    const { initLogin } = useAuth();
    initLogin();

    const myRef = ref(5);
    const myComputed = computed({
      get: () => {
        return myRef.value + 1;
      },
      set: (newVal: number) => {
        myRef.value = newVal - 1;
      },
    });

    // Provide & Inject
    provide("myComputed", myComputed);

    // const stop = watchEffect(
    //   (onInvalidate) => {
    //     onInvalidate(() => {
    //       // Do something to invalidate the network request...
    //     });

    //     // Can do network request...
    //     console.log("myRef.value", myRef.value);
    //     console.log("myComputed.value", myComputed.value);
    //   },
    //   {
    //     flush: "post",
    //     onTrigger(evt) {
    //       console.log("onTrigger", evt);
    //     },
    //     onTrack(evt) {
    //       console.log("onTrack", evt);
    //     },
    //   }
    // );

    const stop = watch(
      [myRef, myComputed],
      ([newMyRef, newMyComputed], [oldMyRef, oldMyComputed], onInvalidate) => {
        onInvalidate(() => {
          //...
        });

        // unwraps the ref automatically
        console.log("myRef.value", newMyRef);
        console.log("oldMyRef", oldMyRef);
        console.log("myComputed", newMyComputed);
        console.log("oldMyComputed", oldMyComputed);
      },
      {
        deep: true, //  to check for changes of properties in a deeply nested object or array
        immediate: true, // ran on first render
        onTrigger(evt) {
          console.log("onTrigger", evt);
        },
        onTrack(evt) {
          console.log("onTrack", evt);
        },
      }
    );

    // Stop the watcher manually
    // setTimeout(() => {
    //   stop();
    // }, 2000);

    // Css modules
    const classes = useCssModule("classes");
    console.log({ classes });
  },
});
</script>

<style scoped>
/* One-off global styles with :global() */
/* :global(body) {
  background: yellow;
} */

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: 0.2s ease-in;
}

.fade-leave-active {
  transition: 0.25s ease-out;
}
</style>

<style module="classes">
.red {
  color: red;
}
</style>
