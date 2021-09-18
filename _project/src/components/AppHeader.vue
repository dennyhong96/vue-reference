<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        exact-active-class="no-active-styles"
        :to="{ name: 'Home' }"
        class="text-white font-bold uppercase text-2xl mr-4"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link :to="{ name: 'About' }" class="px-2 text-white"
              >About</router-link
            >
          </li>

          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" @click.prevent="toggleAuthModal" href="#"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link :to="{ name: 'Manage' }" class="px-2 text-white"
                >Manage</router-link
              >
            </li>
            <li>
              <a class="px-2 text-white" @click.prevent="signOut" href="#"
                >Logout</a
              >
            </li>
          </template>
        </ul>

        <div class="ml-auto">
          <select
            class="py-1 px-2 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
            :value="currentLocale"
            @change="handleChangeLocale"
          >
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇹🇫 French</option>
            <option value="zh">🇨🇳 Chinese</option>
          </select>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapState } from "vuex";

export default defineComponent({
  name: "AppHeader",

  data() {
    return {
      currentLocale: this.$i18n.locale as "en" | "zh" | "fr",
    };
  },

  computed: {
    ...mapState(["userLoggedIn"]),
  },

  methods: {
    ...mapMutations(["toggleAuthModal"]),

    handleChangeLocale(evt: Event) {
      this.$i18n.locale = (evt.target as HTMLSelectElement).value;
    },

    signOut() {
      this.$store.dispatch("signOut");
      if (!this.$route.meta.requiresAuth) return;
      this.$router.push({ name: "Home" });
    },

    // toggleAuthModal() {
    //   this.$store.commit("toggleAuthModal");
    // },
  },
});
</script>
