<template>
  <button @click="onClickAge">Increase Age</button>
  <button @click="ageChangeFn(5)">Increase Age</button>
  <p>The user is {{ ageFractional }} years old.</p>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "User",

  props: {
    age: {
      // required: true,
      type: Number as PropType<number>,
      default: 20,

      // validator is ran before component is created
      validator(val: number) {
        return val <= 130;
      },
    },

    ageChangeFn: {
      required: true,
      type: Function as PropType<() => void>,
    },
  },

  computed: {
    ageFractional() {
      return this.age.toFixed(2);
    },
  },

  methods: {
    onClickAge() {
      this.$emit("ageChange", 3);
    },
  },

  emits: ["ageChange"],
});
</script>
