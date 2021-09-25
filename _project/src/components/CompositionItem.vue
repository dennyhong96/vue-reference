<template>
  <!-- Composition Item -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showEditForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        @click="handleDeleteSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showEditForm = !showEditForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showEditForm">
      <div
        v-if="showAlert"
        :class="alertVariant"
        class="text-white text-center font-bold p-4 mb-4"
      >
        {{ alertMessage }}
      </div>

      <VeeForm
        :validation-schema="formValidationSchema"
        :initial-values="song"
        @submit="handleUpdateSong"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            as="input"
            type="text"
            name="modifiedName"
            @input="handleUpdateHasUnsavedForm(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            as="input"
            type="text"
            name="genre"
            @input="handleUpdateHasUnsavedForm(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600 mr-1"
          :disabled="isUpdating"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="isUpdating"
          @click.prevent="showEditForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from "vue";

import { songsCollection, storage } from "@/includes/firebase";
import { SongWithId } from "@/types/Song";

type SongForm = Pick<SongWithId, "modifiedName" | "genre">;

interface CompositionItemState {
  showEditForm: boolean;

  formValidationSchema: {
    modifiedName: "required";
    genre: "alpha_spaces";
  };

  showAlert: boolean;
  isUpdating: boolean;
  alertVariant: "bg-blue-500" | "bg-green-500" | "bg-red-500";
  alertMessage: string;
}

export default defineComponent({
  name: "CompositionItem",

  setup(props) {
    const state = reactive<CompositionItemState>({
      showEditForm: false,

      formValidationSchema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },

      showAlert: false,
      isUpdating: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Please wait, updating song info.",
    });

    const handleDeleteSong = async () => {
      state.isUpdating = true;
      state.showAlert = true;
      state.alertVariant = "bg-blue-500";
      state.alertMessage = "Please wait, deleting song...";

      try {
        // Delete song from DB
        const deleteFromDBPromise = songsCollection.doc(props.song.id).delete();

        // Delete song file from storage
        const storageRef = storage.ref();
        const songRef = storageRef.child(`songs/${props.song.originalName}`);
        const deleteFromStoragePromise = songRef.delete();

        await Promise.all([deleteFromDBPromise, deleteFromStoragePromise]);

        // Delete song local data
        props.handleDeleteLocalSong(props.song.id);
      } catch (error) {
        console.error("Delete song error:", error);
      }
    };

    const handleUpdateSong = async (values: SongForm) => {
      state.isUpdating = true;
      state.showAlert = true;
      state.alertVariant = "bg-blue-500";
      state.alertMessage = "Please wait, updating song info.";

      const { modifiedName, genre } = values;
      if (
        modifiedName !== props.song.modifiedName ||
        genre !== props.song.genre
      ) {
        try {
          // Update DB
          await songsCollection
            .doc(props.song.id)
            .update({ modifiedName, genre });

          // Update Local data
          props.handleUpdateLocalSongs({
            id: props.song.id,
            modifiedName,
            genre,
          });

          props.handleUpdateHasUnsavedForm(false);
          state.isUpdating = false;
          state.alertVariant = "bg-green-500";
          state.alertMessage = "Song is successfully updated...";
        } catch (error) {
          console.error("Update song error:", error);
          state.isUpdating = false;
          state.alertVariant = "bg-red-500";
          state.alertMessage = "Something went wrong, please try again later.";
        }
      }
    };

    return {
      ...toRefs(state),

      handleDeleteSong,
      handleUpdateSong,
    };
  },

  props: {
    song: {
      required: true,
      type: Object as PropType<SongWithId>,
    },

    handleUpdateLocalSongs: {
      required: true,
      type: Function as PropType<
        (arg: Pick<SongWithId, "id" | "modifiedName" | "genre">) => void
      >,
    },

    handleDeleteLocalSong: {
      required: true,
      type: Function as PropType<(id: string) => void>,
    },

    handleUpdateHasUnsavedForm: {
      required: true,
      type: Function as PropType<(value: boolean) => void>,
    },
  },

  emits: ["deleteSong"],
});
</script>
