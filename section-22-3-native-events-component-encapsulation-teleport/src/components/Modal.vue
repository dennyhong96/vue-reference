<template>
  <div class="modal" :style="{ display: show ? 'block' : 'none' }">
    <div class="modal-dialog" style="z-index: 2000;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Awesome Title</h5>

          <button type="button" class="close" @click="close">
            <span>&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <p>Awesome content.</p>
        </div>
      </div>
    </div>

    <div class="modal-backdrop show"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType } from "vue";

export default defineComponent({
  name: "AppModal",

  props: {
    show: {
      required: true,
      type: Boolean as PropType<boolean>,
    },

    scrollable: {
      default: false,
      type: Boolean as PropType<boolean>,
    },
  },

  methods: {
    close() {
      this.$emit("hide");
    },

    handler(evt: KeyboardEvent) {
      if (evt.code === "Escape" && this.show) {
        this.close();
      }
    },
  },

  created() {
    document.addEventListener("keydown", this.handler);
  },

  unmounted() {
    document.removeEventListener("keydown", this.handler);
  },

  watch: {
    show: {
      immediate: true, // tell vue to run the watcher function when it's initially set
      handler(newValue: boolean) {
        console.log({ newValue });
        // if (!newValue) return;

        // // Use nextTick to give the browser a chance to toggle the element before focusing on it
        // // The callback is ran when document in browser is updated, waiting for modal to be visible first
        // // await nextTick(); // Same, Promise based
        // this.$nextTick(() => (this.$refs.modalRef as HTMLDivElement)?.focus());

        // Disable scroll when modal is open
        if (this.scrollable) return;
        if (newValue) {
          document.body.style.setProperty("overflow-y", "hidden");
        } else {
          document.body.style.removeProperty("overflow-y");
        }
      },
    },
  },
});
</script>

<style scoped>
/* .modal-dialog {
  outline: 0;
} */
</style>
