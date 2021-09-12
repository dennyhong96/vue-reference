<template>
  <div class="mt-2 ml-2" style="opacity:0.5;">
    <button type="button" class="btn btn-primary" @click="open = true">
      Open
    </button>

    <!-- Keep components' relationship close while not affecting them visually -->
    <teleport to="#modals">
      <app-modal :show="open" @hide="open = false" />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AppModal from "@/components/Modal.vue";

export default defineComponent({
  name: "AppAction",

  components: {
    AppModal,
  },

  data() {
    return {
      open: false,
    };
  },
});
</script>
