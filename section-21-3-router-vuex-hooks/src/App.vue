<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link v-if="showAbout" to="/about/admin">About</router-link>
  </div>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",

  setup() {
    const store = useStore(); // this.$store
    const showAbout = computed(() => store.getters.showAbout); // use computed to turn getter value reactive

    setTimeout(() => {
      store.commit("setShowAbout", true);
    }, 3000);

    return { showAbout };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
