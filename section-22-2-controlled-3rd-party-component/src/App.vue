<template>
  <div id="app" class="row d-flex justify-content-center">
    <div class="col-md-5 mt-3">
      <div class="card">
        <div class="card-header">Emoji Selector</div>

        <div class="card-body">
          <form @submit.prevent="submit">
            <div class="form-group">
              <EmojiInput v-model="emoji" :options="{ position: 'bottom' }" />
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import EmojiInput, { IEmoji } from "@/components/EmojiInput.vue";

export default defineComponent({
  name: "App",

  components: {
    EmojiInput,
  },

  data() {
    return {
      emoji: {} as IEmoji,
    };
  },

  methods: {
    submit() {
      console.log("Emoji: ", this.emoji);
    },
  },
});
</script>

<style src="bootstrap/dist/css/bootstrap.css"></style>
