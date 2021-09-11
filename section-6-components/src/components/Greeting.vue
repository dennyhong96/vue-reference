<template>
  <p v-if="age >= 25">{{ msg }}</p>
  <p v-else>You must be 25 years or older to view this message.</p>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Greeting",

  data() {
    return {
      msg: "Hello, World!",
    };
  },

  props: {
    age: {
      required: true,
      type: Number as PropType<number>,
    },
  },
});
</script>

<style scoped lang="scss">
$color: red;

p {
  color: $color;
}
</style>
