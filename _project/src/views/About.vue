<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{ foo }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import dummyStoreModule from "@/store/modules/dummy";
import { mapState } from "vuex";
import { State } from "@/store";

export default defineComponent({
  name: "About",

  // Register module dynamically - extends the store at a later time.
  created() {
    this.$store.registerModule("dummy", dummyStoreModule);
    console.log(`"dummy" store module is dynamically registered.`);
    console.log(`The value of "foo" is "${this.$store.state.dummy.foo}"`);
  },

  computed: {
    ...mapState({
      foo: (state) => (state as State).dummy.foo,
    }),
  },
});
</script>
