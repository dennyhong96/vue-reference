const app = Vue.createApp({
  data() {
    return {
      title: "Hello",
    };
  },
  methods: {
    test() {
      console.log("This is a test");
    },
  },
}).mount("#app");

// Below line updates the DOM "manually", the data is still "Hello", this is an anti-pattern
// Should alway let Vue handle DOM manipulation via reactivity
app.$refs.greeting.innerText = "Updated hello!";
