<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload ref="uploadComponentRef" />
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
            <!-- Composition Items -->
            <div class="border border-gray-200 p-3 mb-4 rounded">
              <div>
                <h4 class="inline-block text-2xl font-bold">Song Name</h4>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                >
                  <i class="fa fa-times"></i>
                </button>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                >
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
              <div>
                <form>
                  <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <input
                      type="text"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Song Title"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <input
                      type="text"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Genre"
                    />
                  </div>
                  <button
                    type="submit"
                    class="py-1.5 px-3 rounded text-white bg-green-600"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    class="py-1.5 px-3 rounded text-white bg-gray-600"
                  >
                    Go Back
                  </button>
                </form>
              </div>
            </div>
            <div class="border border-gray-200 p-3 mb-4 rounded">
              <div>
                <h4 class="inline-block text-2xl font-bold">Song Name</h4>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                >
                  <i class="fa fa-times"></i>
                </button>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                >
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
            </div>
            <div class="border border-gray-200 p-3 mb-4 rounded">
              <div>
                <h4 class="inline-block text-2xl font-bold">Song Name</h4>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                >
                  <i class="fa fa-times"></i>
                </button>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                >
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
            </div>
            <div class="border border-gray-200 p-3 mb-4 rounded">
              <div>
                <h4 class="inline-block text-2xl font-bold">Song Name</h4>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                >
                  <i class="fa fa-times"></i>
                </button>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                >
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
            </div>
            <div class="border border-gray-200 p-3 mb-4 rounded">
              <div>
                <h4 class="inline-block text-2xl font-bold">Song Name</h4>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                >
                  <i class="fa fa-times"></i>
                </button>
                <button
                  class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                >
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Upload from "@/components/Upload.vue";
// import store from "@/store";

export default defineComponent({
  name: "Manage",

  components: {
    Upload,
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
