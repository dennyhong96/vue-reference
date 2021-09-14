<template>
  <div>
    <!-- Slot props are available in the parent component -->
    <slot :user="user" :favorites="favorites"></slot>
  </div>
</template>

<script lant="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",

  data() {
    return {
      user: { name: "John", age: 25 },
      favorites: ["Pizza", "Marbles", "Birds"],
    };
  },
});
</script>
