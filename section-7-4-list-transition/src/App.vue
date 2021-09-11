<template>
  <button @click="addItem">Add an item</button>

  <transition-group tag="ul" name="list" class="list">
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

  will-change: transform;
}

.list {
  padding: 0;
  width: max-content;

  position: relative;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: 0.3s ease;
}

.list-leave-active {
  position: absolute;
}
</style>
