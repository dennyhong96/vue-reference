<template>
  <div class="about">
    <h1>{{ $route.params.member }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "About",

  setup(props, context) {
    // useRoute to get information about the current route
    const route = useRoute(); // this.$route
    console.log(route.params.member);

    // useRouter to interact with the router
    const router = useRouter(); // this.$router
    router.push({
      hash: "#test",
    });
  },
});
</script>
