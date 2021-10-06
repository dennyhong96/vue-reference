<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDraggedOver = false"
        @dragover.prevent.stop="isDraggedOver = true"
        @dragenter.prevent.stop="isDraggedOver = true"
        @dragleave.prevent.stop="isDraggedOver = false"
        @drop.prevent.stop="handleUpload"
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDraggedOver }"
      >
        <h5>Drop your files here</h5>
      </div>

      <input type="file" multiple @change="handleUpload" />
      <hr class="my-6" />

      <!-- Progess Bars -->
      <div v-for="upload in uploads" :key="upload.songId" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: `${upload.currentProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase, { auth, songsCollection, storage } from "@/includes/firebase";
import {
  defineComponent,
  onBeforeUnmount,
  PropType,
  reactive,
  toRefs,
  defineExpose,
} from "vue";

import { Song, SongWithId } from "@/types/Song";

export interface Upload {
  songId: string;
  task: firebase.storage.UploadTask;
  currentProgress: number;
  name: string;
  variant: "bg-blue-400" | "bg-red-400" | "bg-green-400";
  icon: "fas fa-spinner fa-spin" | "fas fa-times" | "fas fa-check";
  textClass: "" | "text-red-400" | "text-green-400";
}

interface UpdateState {
  isDraggedOver: boolean;
  uploads: Upload[];
}

export default defineComponent({
  name: "Upload",

  setup(props) {
    const state = reactive<UpdateState>({
      isDraggedOver: false,
      uploads: [],
    });

    const handleUpload = async (evt: DragEvent | Event) => {
      state.isDraggedOver = false;

      let files: File[] | undefined;
      if ("dataTransfer" in evt) {
        // Files are uploaded via dropzone
        if (!evt.dataTransfer?.files) return;
        files = [...evt.dataTransfer.files];
      } else {
        // Files are uploaded via files input
        const target = evt.target as HTMLInputElement | null;
        if (!target?.files) return;
        files = [...target.files];
      }

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") return;

        // Upload song file to storage
        const storageRef = storage.ref(); // root
        const songRef = storageRef.child(`songs/${file.name}`); // songs directory under root
        const uploadTask = songRef.put(file);

        const songId = songsCollection.doc().id;

        // Throw error if the user does NOT have connection to the internet (Cached PWA Mode)
        if (!navigator.onLine) {
          return state.uploads.push({
            songId,
            task: {} as firebase.storage.UploadTask,
            currentProgress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            textClass: "text-red-400",
          });
        }

        state.uploads.push({
          songId,
          task: uploadTask,
          currentProgress: 0,
          name: file.name,
          variant: "bg-blue-400",
          icon: "fas fa-spinner fa-spin",
          textClass: "",
        });

        const upload = state.uploads.find((upload) => upload.songId === songId);

        uploadTask.on(
          "state_changed",

          // Handle upload progress
          (snapshot) => {
            const newProgressPct =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            if (!upload) return;
            upload.currentProgress = newProgressPct;
          },

          // Handle upload error
          (error) => {
            if (!upload) return;
            upload.variant = "bg-red-400";
            upload.icon = "fas fa-times";
            upload.textClass = "text-red-400";
            console.error("Upload Error", error);
          },

          // Handle upload complete
          async () => {
            if (!auth.currentUser) return;
            // Save file data into DB
            const song: Song = {
              uid: auth.currentUser.uid,
              displayName:
                auth.currentUser.displayName ?? `User_${auth.currentUser.uid}`,
              originalName: uploadTask.snapshot.ref.name,
              modifiedName: uploadTask.snapshot.ref.name,
              genre: "",
              commentCount: 0,
              url: await uploadTask.snapshot.ref.getDownloadURL(),
            };

            // Add new song data to DB
            await songsCollection.doc(songId).set(song);

            // Add new song to local data
            props.handleCreateLocalSong({ id: songId, ...song });

            if (!upload) return;
            upload.variant = "bg-green-400";
            upload.icon = "fas fa-check";
            upload.textClass = "text-green-400";

            setTimeout(() => {
              state.uploads = state.uploads.filter(
                (upload) => upload.songId !== songId
              );
            }, 3000);
          }
        );
      });
    };

    const cancelUploads = () => {
      state.uploads.forEach((upload) => upload.task.cancel());
    };
    onBeforeUnmount(cancelUploads);

    const logFromUpload = () => {
      console.log("logFromUpload");
    };

    return {
      handleUpload,
      logFromUpload,

      ...toRefs(state),
    };
  },

  props: {
    handleCreateLocalSong: {
      required: true,
      type: Function as PropType<(newSong: SongWithId) => void>,
    },
  },
});
</script>
