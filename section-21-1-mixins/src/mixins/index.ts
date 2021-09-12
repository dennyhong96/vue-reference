interface Data {
  offset: number;
}

interface Methods {
  update: () => void;
}

interface This extends Data, Methods {}

const mixin = {
  data(): Data {
    return {
      offset: 0,
    };
  },

  mounted(this: This): void {
    console.log("mounted lifecycle hook from mixin ran...");
    // this.update();
    window.addEventListener("scroll", this.update, { passive: false });
  },

  methods: {
    update(this: This) {
      this.offset = window.pageYOffset;
    },
  } as Methods,
};

export default mixin;
