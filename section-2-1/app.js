// vm is short for View(HTML) Model(Data)
const vm = Vue.createApp({
  data() {
    return {
      firstName: "Denny",
      middleName: "",
      lastName: "Hong",
      url: "https://google.com",
      rawUrl: `<a href="https://google.com" target="_blank">Google</a>`,
      age: 24,
    };
  },
  methods: {
    handleIncreaseAge() {
      this.age++;
    },
    handleUpdateLastName(msgToLog, evt) {
      // evt.preventDefault();
      console.log(msgToLog);
      this.lastName = evt.target.value;
    },
    handleUpdateMiddleName(evt) {
      this.middleName = evt.target.value;
    },
  },
  // computed value can't be async
  computed: {
    // fullName is only called and re-calculated when one of firstName, middleName, or lastName changes.
    // But not age.
    fullName() {
      console.log("fullName computed property is called...");

      // computed properties must return a value
      return `${this.firstName} ${
        this.middleName
      } ${this.lastName.toUpperCase()}`;
    },
  },
  // run addtional logic when a value changes, watchers can be async
  watch: {
    age(newVal, oldVal) {
      setTimeout(() => {
        this.age = 20;
      }, 3000);
    },
  },
}).mount("#app");

// setTimeout(() => {
//   // Vue proxies data directly onto the vm object
//   vm.firstName = "Bob"; // with the proxy
//   // vm.$data.firstName = "Bob" // without the proxy
// }, 2000);

// Multiple instances on a page
// Vue.createApp({
//   data() {
//     return {
//       firstName: "Sharon",
//       lastName: "Zhang",
//     };
//   },
// }).mount("#app2");
