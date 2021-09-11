<template>
  <h3>Hey!</h3>
  <Greeting :age="age" />

  <!-- Only parent components can listen to emitted events from children components -->
  <User
    @ageChange="increaseAge"
    :age="age"
    :ageChangeFn="increaseAgeCallback"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Greeting from "@/components/Greeting.vue";
import User from "@/components/User.vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      age: 20,
    };
  },

  methods: {
    increaseAge(increaseby: number) {
      this.age += increaseby;
    },

    increaseAgeCallback(increaseby: number) {
      this.age += increaseby;
    },
  },

  // Regist component locally, only available in this component
  components: {
    Greeting,
    User,
  },
});
</script>
