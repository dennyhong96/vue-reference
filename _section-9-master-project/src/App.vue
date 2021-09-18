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
import { defineComponent } from "vue";

import AppHeader from "@/components/AppHeader.vue";
import AuthModal from "@/components/AuthModal.vue";
import Player from "@/components/Player.vue";

export default defineComponent({
  name: "App",

  components: {
    AppHeader,
    AuthModal,
    Player,
  },

  created() {
    this.$store.dispatch("initLogin");
  },
});
</script>

<style scoped>
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
