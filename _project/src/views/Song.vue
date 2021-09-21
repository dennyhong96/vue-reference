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
import { defineComponent } from "vue";
import { FormContext } from "vee-validate";
import { mapActions, mapGetters, mapState } from "vuex";

import {
  auth,
  commentsCollections,
  songsCollection,
} from "@/includes/firebase";
import { Song, SongWithId } from "@/types/Song";
import { CommentWithId, Comment } from "@/types/Comment";
import { State } from "@/store";

type Sort = "DESC" | "ASC";

export default defineComponent({
  name: "Song",

  data() {
    return {
      song: null as SongWithId | null,

      comments: [] as CommentWithId[],
      sort: "DESC" as Sort,

      validationSchema: {
        comment: "required|min:3",
      },

      submissionInProgress: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Submitting your comment, please wait...",
    };
  },

  async created() {
    const songDoc = await songsCollection
      .doc(this.$route.params.id as string)
      .get();

    // Firebase doesn't throw error if doc is deleted
    if (!songDoc.exists) return this.$router.push({ name: "Home" });

    this.song = { id: songDoc.id, ...(songDoc.data() as Song) };

    this.sort = (this.$route.query.sort as Sort | undefined) ?? "DESC";

    this.listComments();
  },

  // Replace `created` lifecycle method with `beforeRouteEnter` route guard if we want to have all the data available when the page loads
  // async beforeRouteEnter(to, from, next) {
  //   const songDoc = await songsCollection.doc(to.params.id as string).get();

  //   next((vm) => {
  //     // The callback is run after the component has loaded after route change
  //     // vm argument is the context of the component, same to `this`

  //     // Firebase doesn't throw error if doc is deleted
  //     if (!songDoc.exists) return vm.$router.push({ name: "Home" });

  //     vm.song = { id: songDoc.id, ...(songDoc.data() as Song) };

  //     vm.sort = (vm.$route.query.sort as Sort | undefined) ?? "DESC";

  //     vm.listComments();
  //   });
  // },

  watch: {
    sort(newValue: Sort) {
      if (newValue === this.$route.query.sort) return;

      this.$router.push({
        query: { sort: newValue },
      });
    },
  },

  computed: {
    ...mapState({
      userLoggedIn: (state) => (state as State).auth.userLoggedIn,
    }),

    ...mapGetters("player", ["isSongPlaying"]),

    sortedComments(): CommentWithId[] {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "DESC") {
          return (
            Number(new Date(b.datePosted)) - Number(new Date(a.datePosted))
          );
        }
        return Number(new Date(a.datePosted)) - Number(new Date(b.datePosted));
      });
    },
  },

  methods: {
    ...mapActions("player", ["playNewSong", "toggleAudio"]),

    async listComments() {
      const snapshots = await commentsCollections
        .where("sid", "==", this.$route.params.id as string)
        .get();

      this.comments = [];

      snapshots.forEach((doc) =>
        this.comments.push({ id: doc.id, ...(doc.data() as Comment) })
      );
    },

    async handleSubmitComment(
      values: { comment: string },
      context: FormContext
    ) {
      if (!this.song) return;

      this.submissionInProgress = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Submitting your comment, please wait...";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id as string,
        name: auth.currentUser?.displayName || "Unknown user",
        uid: auth.currentUser?.uid || "Unknown user id",
      };

      const commentId = commentsCollections.doc().id;
      try {
        await commentsCollections.doc(commentId).set({
          id: commentId,
          ...comment,
        });

        context.resetForm();

        // Increment the comment count
        this.song.commentCount += 1;
        songsCollection
          .doc(this.song.id)
          .update({ commentCount: this.song.commentCount });

        // List latest comments
        this.listComments();

        this.submissionInProgress = false;
        this.showAlert = true;
        this.alertVariant = "bg-green-500";
        this.alertMessage = "Your comment is successfully submitted.";
      } catch (error) {
        this.submissionInProgress = false;
        this.showAlert = true;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Something went wrong, please try again later.";
      }
    },
  },
});
</script>
