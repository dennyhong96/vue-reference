<template>
  <!-- Player -->
  <div
    class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16"
  >
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="toggleAudio">
          <i
            class="text-gray-500 text-xl"
            :class="{
              'fa fa-play': !isSongPlaying,
              'fa fa-pause': isSongPlaying,
            }"
          ></i>
        </button>
      </div>

      <!-- Current Position -->
      <div
        class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1"
      >
        <span class="player-currenttime">{{ seek }}</span>
      </div>

      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div
          v-if="currentSong"
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
        >
          <span class="song-title">{{ currentSong?.modifiedName }}</span>
          <span class="song-artist">
            (Uploaded by {{ currentSong?.displayName }})</span
          >
        </div>
        <span
          @click.prevent="updateSeek"
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
        >
          <span
            class="absolute top-neg-8 text-gray-800	text-lg"
            :style="{ left: playerProgress }"
          >
            <i class="fas fa-circle"></i>
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </span>
      </div>

      <!-- Duration -->
      <div
        class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1"
      >
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default defineComponent({
  name: "Player",

  data() {
    return {};
  },

  methods: {
    ...mapActions(["toggleAudio", "updateSeek"]),
  },

  computed: {
    ...mapState(["seek", "duration", "playerProgress", "currentSong"]),
    ...mapGetters(["isSongPlaying"]),
  },
});
</script>
