<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition 
          duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'Song', params: { id: song.id } }"
        class="font-bold block text-gray-600"
        >{{ song.modifiedName }}</router-link
      >
      <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments">
        <i class="fa fa-comments text-gray-600"></i>
        {{ song.commentCount }}
      </span>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { SongWithId } from "@/types/Song";

export default defineComponent({
  name: "SongItem",

  props: {
    song: {
      required: true,
      type: Object as PropType<SongWithId>,
    },
  },
});
</script>
