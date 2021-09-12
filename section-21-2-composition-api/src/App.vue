<template>
  <!-- Vue unwraps the ref automatically, no need to do num.value -->
  <div>num - {{ num }}</div>
  <div>double - {{ double }}</div>
  <button @click="increment">Increment</button>

  <hr />

  <div>{{ name }} - {{ age }}</div>

  <hr />

  <input type="text" v-model="phrase" />
  <p>{{ reversePhrase }}</p>

  <Alert :user="user" />

  <!-- ref must be the name of the template ref, not the ref value itself -->
  <button ref="btn">Button</button>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import useNumber from "@/hooks/useNumber";
import usePhrases from "@/hooks/usePhrases";

import Alert from "@/components/Alert.vue";

export default defineComponent({
  name: "App",

  components: {
    Alert,
  },

  setup() {
    // Using the composition function (composable, hook)
    const { num, double, increment } = useNumber();

    // ref() can also be used to store a template reference, initial value must be null
    // element is bound to the template ref after mounted, available during onMounted lifecycle
    const btn = ref<HTMLButtonElement | null>(null);
    console.log(btn.value); // null

    onBeforeMount(() => {
      console.log("onBeforeMount called");
    });
    function buttonClickCallback() {
      console.log("button is clicked");
    }
    onMounted(() => {
      console.log("onMounted called");
      console.log(btn.value); // button
      btn.value?.addEventListener("click", buttonClickCallback);
    });
    onBeforeUnmount(() => {
      // Clean up
      btn.value?.removeEventListener("click", buttonClickCallback);
    });

    // Reactive value must be an object
    // Reactive object cannot be destructured or spreaded
    let user = reactive({ name: "Denny", age: 24 });
    setTimeout(() => {
      // access reactive value directly
      user.name = "Sharon";
      user.age = 27;

      // CANNOT re-assign !!!
      // user = {
      //   name: "What",
      //   age: 10,
      // };
    }, 3000);

    const { phrase, reversePhrase } = usePhrases();

    return {
      btn,

      num,
      double,
      increment,

      user,
      ...toRefs(user), // toRefs convert reactive object properties into individual reactive references
      // ...user, // This won't work, cannot spread reactive object

      phrase,
      reversePhrase,
    };
  },
});
</script>

<style></style>
