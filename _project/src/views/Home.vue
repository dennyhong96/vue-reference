<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <!-- $t() is available after registering i18n as a plugin -->
          <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        >
          <span class="card-title">Songs</span>
        </div>

        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :song="song" :key="song.id" />
        </ol>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onBeforeUnmount } from "vue";

import iconSecondary from "@/directives/iconSecondary";
import SongItem from "@/components/SongItem.vue";
import { songsCollection } from "@/includes/firebase";
import { Song, SongWithId } from "@/types/Song";

interface HomeState {
  songs: SongWithId[];
  numSongsPerPage: number;
  requestPending: boolean;
}

export default defineComponent({
  name: "Home",

  components: {
    SongItem,
  },

  setup() {
    const state = reactive<HomeState>({
      songs: [],
      numSongsPerPage: 25,
      requestPending: false,
    });

    const listSongs = async () => {
      if (state.requestPending) return; // Prevent triggering request multiple times in parallel, resulting in inconsist results
      state.requestPending = true;

      // Limit
      let query = songsCollection
        .orderBy("modifiedName")
        .limit(state.numSongsPerPage);

      // Offset
      if (state.songs.length) {
        const lastDoc = await songsCollection
          .doc(state.songs[state.songs.length - 1]?.id)
          .get();
        query = query.startAfter(lastDoc);
      }

      const songsSnapshot = await query.get();
      songsSnapshot.forEach((doc) =>
        state.songs.push({ id: doc.id, ...(doc.data() as Song) })
      );

      state.requestPending = false;
    };

    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const isScrolledToBottom =
        Math.ceil(scrollTop) + innerHeight >= offsetHeight;
      if (!isScrolledToBottom) return;
      listSongs();
    };

    listSongs();
    window.addEventListener("scroll", handleScroll);
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return toRefs(state);
  },

  // Register directives locally
  directives: {
    "icon-secondary": iconSecondary,
  },
});
</script>
