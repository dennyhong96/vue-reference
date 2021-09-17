<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload
          :handleCreateLocalSong="handleCreateLocalSong"
          ref="uploadComponentRef"
        />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <CompositionItem
              :handleUpdateLocalSongs="handleUpdateLocalSongs"
              :handleDeleteLocalSong="handleDeleteLocalSong"
              :handleUpdateHasUnsavedForm="handleUpdateHasUnsavedForm"
              v-for="song in songs"
              :key="song.id"
              :song="song"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Upload from "@/components/Upload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { auth, songsCollection, storage } from "@/includes/firebase";
import { Song, SongWithId } from "@/types/Song";
// import store from "@/store";

export default defineComponent({
  name: "Manage",

  components: {
    Upload,
    CompositionItem,
  },

  data() {
    return {
      songs: [] as SongWithId[],
      hasUnsavedForm: false,
    };
  },

  // Vue will not await for the async created() before mounting the component, however, not a big deal here.
  async created() {
    const songsSnapshot = await songsCollection
      .where("uid", "==", auth.currentUser?.uid)
      .get();

    for (const songDoc of songsSnapshot.docs) {
      this.handleCreateLocalSong({
        id: songDoc.id,
        ...(songDoc.data() as Song),
      });
    }
  },

  // Prevent from navigating away if user is currently updating a song
  beforeRouteLeave(to, from, next) {
    let navigate = true;

    if (this.hasUnsavedForm) {
      navigate = confirm(
        "You have unsaved changes, are you sure you want to leave this screen?"
      );
    }

    next(navigate);
  },

  methods: {
    handleCreateLocalSong(newSong: SongWithId) {
      this.songs.push(newSong);
    },

    handleUpdateLocalSongs({
      id,
      modifiedName,
      genre,
    }: Pick<SongWithId, "id" | "modifiedName" | "genre">) {
      this.songs = this.songs.map((song) =>
        song.id === id ? { ...song, modifiedName: modifiedName, genre } : song
      );
    },

    handleDeleteLocalSong(id: string) {
      this.songs = this.songs.filter((song) => song.id !== id);
    },

    handleUpdateHasUnsavedForm(value: boolean) {
      this.hasUnsavedForm = value;
    },
  },

  // Use beforeRouteLeave() route guard to unsubscribe/cancel long living tasks
  // beforeRouteLeave(to, from, next) {
  //   // Cancel unfinished files uploads before navigating away from the route
  //   // Use a ref for <Upload /> component instance and access the component's cancelUploads() method
  //   (this.$refs.uploadComponentRef as {
  //     cancelUploads: () => void;
  //   }).cancelUploads();

  //   next();
  // },

  // Local route guard, ran before rendering component
  // beforeRouteEnter(to, from, next) {
  //   console.log("Manage beforeRouteEnter", { to });
  //   console.log("Manage beforeRouteEnter", { from });

  //   // cannot access this.$store because this points to the component which is not created yet
  //   // import the store directly and use it that way
  //   if (!store.state.userLoggedIn) {
  //     return next({ name: "Home" }); // redirect to Home
  //   }

  //   // Component is not created until next() is called
  //   // So can't access data, methods, etc
  //   next();
  // },
});
</script>
