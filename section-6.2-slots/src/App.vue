<template>
  <Form>
    <template v-slot:help>
      <!-- Inversion of control -->
      <p>{{ help }}</p>
    </template>

    <template v-slot:fields>
      <input type="text" placeholder="email" />
      <input type="text" placeholder="username" />
      <input type="text" placeholder="password" />
    </template>

    <template v-slot:buttons>
      <button type="submit">Submit</button>
    </template>

    <p>Dummy text!</p>
  </Form>

  <Form>
    <template v-slot:help>
      <p>Contact help text.</p>
    </template>

    <template v-slot:fields>
      <input type="text" placeholder="name" />
      <input type="text" placeholder="message" />
    </template>

    <template v-slot:buttons>
      <button type="submit">Submit</button>
    </template>
  </Form>

  <p>Dummy text!</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Form from "@/components/Form.vue";

export default defineComponent({
  name: "App",

  components: {
    Form,
  },

  data() {
    return {
      help: "This is some help text.",
    };
  },
});
</script>
