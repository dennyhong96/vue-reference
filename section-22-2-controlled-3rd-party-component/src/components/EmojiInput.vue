<template>
  <div class="input-group">
    <input
      :value="modelValue.emoji"
      @input="update($event)"
      type="text"
      class="form-control"
      readonly
    />

    <div class="input-group-append">
      <button ref="buttonRef" class="btn btn-outline-secondary" type="button">
        {{ modelValue.emoji ?? "Select" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { EmojiButton } from "@joeattardi/emoji-button";
import { EmojiButtonOptions } from "@joeattardi/emoji-button/dist/types";

export interface IEmoji {
  emoji: string;
  name: string;
}

export default defineComponent({
  name: "EmojiInput",

  // setup() {},
  props: {
    modelValue: {
      required: true,
      type: Object as PropType<IEmoji>,
    },

    options: {
      default() {
        return {};
      },
      type: Object as PropType<EmojiButtonOptions>,
    },
  },

  mounted(): void {
    // https://emoji-button.js.org/
    // https://emoji-button.js.org/docs/api
    const picker = new EmojiButton(this.options);
    const trigger = this.$refs.buttonRef as HTMLButtonElement;
    picker.on("emoji", (selectedEmoji: IEmoji) => {
      console.log({ selectedEmoji });
      this.$emit("update:modelValue", selectedEmoji);
    });
    trigger.addEventListener("click", () => picker.togglePicker(trigger));
  },

  emits: ["update:modelValue"],
});
</script>
