const vm = Vue.createApp({
  // Define template in options
  // template: `{{ message }}`,

  // data() {
  //   return {
  //     message: "Hello world!",
  //   };
  // },

  // Lifecycle hooks
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

// Available after vm instance is created
vm.component("hello", {
  template: `<h1>{{ message }}</h1>`,
  data() {
    return {
      message: "Hello, World!",
    };
  },
});

vm.mount("#app");

// setTimeout(() => {
//   vm.mount("#app");
// }, 3000);

// const vm2 = Vue.createApp({
//   data() {
//     return {
//       message: "Hello world!",
//     };
//   },

//   // if render() is specified, create object manually without the compiler
//   render() {
//     // h() stands for hyperscript - create html with javascript
//     return Vue.h("h1", this.message);
//   },
// }).mount("#app2");
