<template>
  <button @click="addItem">Add an item</button>

  <!-- Overwrite classnames to use animate.css library -->
  <!-- <transition-group
    tag="ul"
    enter-from-class=""
    enter-active-class=""
    enter-to-class=""
    leave-from-class=""
    leave-active-class=""
    leave-to-class=""
  > -->

  <!-- animate__animated is requred to use animate.css animations -->
  <transition-group
    tag="ul"
    class="list"
    enter-active-class="animate__animated animate__flipInX"
    leave-active-class="animate__animated animate__flipOutX"
    move-class="list-move"
  >
    <li
      class="list-item"
      v-for="id in ids"
      :key="id"
      @click="handleRemoveItem(id)"
    >
      {{ id }}
    </li>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      ids: [] as string[],
    };
  },

  methods: {
    randomId() {
      return (
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9)
      );
    },

    addItem() {
      const indexToInsert = Math.floor(Math.random() * this.ids.length);
      const newItem = this.randomId();
      this.ids.splice(indexToInsert, 0, newItem);
    },

    handleRemoveItem(id: string) {
      this.ids = this.ids.filter((currId) => currId !== id);
    },
  },
});
</script>

<style scoped>
.list-item {
  font-size: 22px;
  cursor: pointer;
  margin-bottom: 8px;
  list-style: none;
  width: max-content;
  border: 1px solid #333;
  padding: 8px;
  background: #fff;

  will-change: transform;
}

.list {
  padding: 0;
  width: max-content;

  position: relative;
}

.list-move {
  transition: 0.3s ease;
}

/* Overwrite animate.css animation duration, default is 1s */
.animate__animated {
  animation-duration: 0.3s;
}

.animate__flipOutX {
  position: absolute;
}
</style>
