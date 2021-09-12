<template>
  <div v-if="!flag" style="color:red;">User has changed!!!</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Alert",

  setup(props, context) {
    // Must use computed otherwise props are not reactive by default within setup()
    const flag = computed(() => props.user.name === "Denny");

    // Emitting events
    // context.emit("eventName", somePayload);

    return { flag };
  },

  props: {
    user: {
      required: true,
      type: Object as PropType<{ name: string; age: number }>,
    },
  },
});
</script>
