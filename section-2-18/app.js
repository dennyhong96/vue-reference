const vm = Vue.createApp({
  data() {
    return {
      isPurple: false,
      selectedColor: "",
      size: 150,
    };
  },
  computed: {
    circleClasses() {
      return { purple: this.isPurple };
    },
  },
}).mount("#app");
