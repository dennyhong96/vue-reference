<template>
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
            <span class="card-title">{{ $t("manage.mySongs") }}</span>
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
import { defineComponent, reactive, toRefs } from "vue";
import { onBeforeRouteLeave } from "vue-router";

import Upload from "@/components/Upload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { auth, songsCollection } from "@/includes/firebase";
import { Song, SongWithId } from "@/types/Song";

interface ManageState {
  songs: SongWithId[];
  hasUnsavedForm: boolean;
}

export default defineComponent({
  name: "Manage",

  components: {
    Upload,
    CompositionItem,
  },

  setup() {
    const state = reactive<ManageState>({
      songs: [],
      hasUnsavedForm: false,
    });

    // Methods
    const handleCreateLocalSong = (newSong: SongWithId) => {
      state.songs.push(newSong);
    };

    const handleUpdateLocalSongs = ({
      id,
      modifiedName,
      genre,
    }: Pick<SongWithId, "id" | "modifiedName" | "genre">) => {
      state.songs = state.songs.map((song) =>
        song.id === id ? { ...song, modifiedName: modifiedName, genre } : song
      );
    };

    const handleDeleteLocalSong = (id: string) => {
      state.songs = state.songs.filter((song) => song.id !== id);
    };

    const handleUpdateHasUnsavedForm = (value: boolean) => {
      state.hasUnsavedForm = value;
    };

    const created = async () => {
      const songsSnapshot = await songsCollection
        .where("uid", "==", auth.currentUser?.uid)
        .get();

      for (const songDoc of songsSnapshot.docs) {
        handleCreateLocalSong({
          id: songDoc.id,
          ...(songDoc.data() as Song),
        });
      }
    };
    created();

    // Prevent from navigating away if user is currently updating a song
    onBeforeRouteLeave((to, from) => {
      let navigate = true;

      if (state.hasUnsavedForm) {
        navigate = confirm(
          "You have unsaved changes, are you sure you want to leave this screen?"
        );
      }

      if (!navigate) return false;
    });

    return {
      handleCreateLocalSong,
      handleUpdateLocalSongs,
      handleDeleteLocalSong,
      handleUpdateHasUnsavedForm,

      ...toRefs(state),
    };
  },
});
</script>
