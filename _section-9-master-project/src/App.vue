<template>
  <AppHeader />
  <router-view></router-view>
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
