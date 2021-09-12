<template>
  <input
    type="email"
    class="form-control"
    placeholder="E-mail"
    :value="email"
    @input="update($event)"
    :class="{
      'is-valid': validateEmail(email),
      'is-invalid': !validateEmail(email),
    }"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// Separation of concerns, framework agnostic busness logic helper, decoupled from UI logic
import { validateEmail } from "@/utils";

export default defineComponent({
  name: "EmailInput",

  // Use modelValue as prop and emit update:modelValue event on input
  // so that parent component can use v-model for two way binding for this component
  props: {
    // modelValue: {
    //   required: true,
    //   type: String as PropType<string>,
    // },
    email: {
      required: true,
      type: String as PropType<string>,
    },
  },

  methods: {
    validateEmail,

    update(evt: InputEvent) {
      // this.$emit(
      //   "update:modelValue",
      //   (evt.target as HTMLInputElement).value as string
      // );
      this.$emit(
        "update:email",
        (evt.target as HTMLInputElement).value as string
      );
    },
  },

  // emits: ["update:modelValue"],
  emits: ["update:email"],
});
</script>
