const vm = Vue.createApp({
  data() {
    return {
      perspective: 100,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    };
  },

  methods: {
    handleReset() {
      this.perspective = 100;
      this.rotateX = 0;
      this.rotateY = 0;
      this.rotateZ = 0;
    },
    async handleCopy() {
      // const el = document.createElement("textarea");
      // el.setAttribute("readonly", "");
      // el.style.position = "absolute";
      // el.style.left = "-99999px";
      // el.value = `
      // perspective: ${this.perspective}px;
      // transform: rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg);
      // `;
      // document.body.appendChild(el);
      // el.select();
      // document.execCommand("copy");
      // document.body.removeChild(el);

      await navigator.clipboard.writeText(`
      perspective: ${this.perspective}px;
      transform: rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg);
      `);

      alert(`Styles has been copied to your clipboard.`);
    },
  },

  computed: {
    style() {
      return {
        perspective: `${this.perspective}px`,
        transform: `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg)`,
      };
    },
  },
}).mount("#app");
