const vm = Vue.createApp({
  data() {
    return {
      message: "Hello world!",
    };
  },
  beforeCreate() {
    console.log("beforeCreate() lifecycle called", this.message, this.$el);
  },
  created() {
    // if only need data, use created()
    console.log("created() lifecycle called", this.message, this.$el);
  },
  beforeMount() {
    console.log("beforeMount() lifecycle called", this.message, this.$el);
  },
  mounted() {
    // if need the template element, use mounted()
    console.log("mounted() lifecycle called", this.message, this.$el);
  },

  beforeUpdate() {
    console.log("beforeUpdate() lifecycle called");
  },
  updated() {
    console.log("updated() lifecycle called");
  },

  beforeUnmount() {
    console.log("beforeUnmount() lifecycle called");
  },
  unmounted() {
    console.log("unmounted() lifecycle called");
  },
});

vm.mount("#app");

// setTimeout(() => {
//   vm.mount("#app");
// }, 3000);
