<template>
  <div class="result">
    <div class="title">{{ result.title }}</div>
    <div class="desc">
      {{ result.desc }}
    </div>
  </div>
</template>

<script lang="ts">
import { IResult } from "@/App.vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Results",

  props: {
    result: {
      required: true,
      type: Object as PropType<IResult>,
    },
  },
});
</script>
