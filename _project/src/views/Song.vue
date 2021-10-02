<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="!isSongPlaying ? playNewSong(song) : toggleAudio()"
          type="button"
          id="play-button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
        >
          <i
            :class="{
              'fas fa-play': !isSongPlaying,
              'fas fa-pause': isSongPlaying,
            }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song?.modifiedName }}</div>
          <div>{{ song?.genre || "Unknown genre" }}</div>
          <!-- $n() translate numeric values -->
          <!-- <div class="song-price">{{ $n(1, "currency", "zh") }}</div> -->
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count, $tc() supports pluralization -->
          <span class="card-title"
            >{{ $tc("song.commentCount", song?.commentCount ?? 0) }}
          </span>
          <!-- <span class="card-title"
            >{{ $t("song.commentCount", { count: song?.commentCount }) }}
          </span> -->
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="showAlert"
            :class="alertVariant"
            class="text-white text-center font-bold p-4 mb-4"
          >
            {{ alertMessage }}
          </div>
          <VeeForm
            v-if="userLoggedIn"
            :validation-schema="validationSchema"
            @submit="handleSubmitComment"
          >
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></VeeField>
            <ErrorMessage name="comment" class="text-red-600" />
            <button
              :disabled="submissionInProgress"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="DESC">Latest</option>
            <option value="ASC">Oldest</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.id"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watchEffect, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FormContext } from "vee-validate";

import {
  auth,
  commentsCollections,
  songsCollection,
} from "@/includes/firebase";
import { Song, SongWithId } from "@/types/Song";
import { CommentWithId, Comment } from "@/types/Comment";
import useAuth from "@/composables/useAuth";
import usePlayer from "@/composables/usePlayer";

type Sort = "DESC" | "ASC";

interface SongState {
  song: SongWithId | null;

  comments: CommentWithId[];
  sort: Sort;

  validationSchema: {
    comment: "required|min:3";
  };

  submissionInProgress: boolean;
  showAlert: boolean;
  alertVariant: "bg-blue-500" | "bg-green-500" | "bg-red-500";
  alertMessage: string;
}

export default defineComponent({
  name: "Song",

  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive<SongState>({
      song: null,

      comments: [],
      sort: "DESC",

      validationSchema: {
        comment: "required|min:3",
      },

      submissionInProgress: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Submitting your comment, please wait...",
    });

    // Methods
    const listComments = async () => {
      const snapshots = await commentsCollections
        .where("sid", "==", route.params.id as string)
        .get();

      state.comments = [];

      snapshots.forEach((doc) =>
        state.comments.push({ id: doc.id, ...(doc.data() as Comment) })
      );
    };

    const handleSubmitComment = async (
      values: { comment: string },
      context: FormContext
    ) => {
      if (!state.song) return;

      state.submissionInProgress = true;
      state.showAlert = true;
      state.alertVariant = "bg-blue-500";
      state.alertMessage = "Submitting your comment, please wait...";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: route.params.id as string,
        name: auth.currentUser?.displayName || "Unknown user",
        uid: auth.currentUser?.uid || "Unknown user id",
      };

      console.log({ comment });

      const commentId = commentsCollections.doc().id;
      try {
        await commentsCollections.doc(commentId).set({
          id: commentId,
          ...comment,
        });

        context.resetForm();

        // Increment the comment count
        state.song.commentCount += 1;
        songsCollection
          .doc(state.song.id)
          .update({ commentCount: state.song.commentCount });

        // List latest comments
        listComments();

        state.submissionInProgress = false;
        state.showAlert = true;
        state.alertVariant = "bg-green-500";
        state.alertMessage = "Your comment is successfully submitted.";
      } catch (error) {
        state.submissionInProgress = false;
        state.showAlert = true;
        state.alertVariant = "bg-red-500";
        state.alertMessage = "Something went wrong, please try again later.";
      }
    };

    const created = async () => {
      const songDoc = await songsCollection
        .doc(route.params.id as string)
        .get();

      // Firebase doesn't throw error if doc is deleted
      if (!songDoc.exists) return router.push({ name: "Home" });

      state.song = { id: songDoc.id, ...(songDoc.data() as Song) };

      state.sort = (route.query.sort as Sort | undefined) ?? "DESC";

      listComments();
    };
    created();

    // computed
    const sortedComments = computed(() => {
      return state.comments.slice().sort((a, b) => {
        if (state.sort === "DESC") {
          return (
            Number(new Date(b.datePosted)) - Number(new Date(a.datePosted))
          );
        }
        return Number(new Date(a.datePosted)) - Number(new Date(b.datePosted));
      });
    });

    watchEffect(() => {
      if (state.sort === route.query.sort) return;
      router.replace({
        query: { sort: state.sort },
        hash: route.hash, // Must specify hash manually, otherwise hash is lost
      });
    });

    const { userLoggedIn } = useAuth();
    const { isSongPlaying, playNewSong, toggleAudio } = usePlayer();

    return {
      handleSubmitComment,
      sortedComments,

      // State
      ...toRefs(state),
      userLoggedIn,

      // Getter
      isSongPlaying,

      // Actions
      playNewSong,
      toggleAudio,
    };
  },
});
</script>
