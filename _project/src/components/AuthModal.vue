<template>
  <!-- Auth Modal -->
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    :class="{ hidden: !authModalShow }"
    id="modal"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center 
      sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div
              @click.prevent="toggleAuthModal"
              class="modal-close cursor-pointer z-50"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                @click.prevent="tab = 'LOGIN'"
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'LOGIN',
                  'hover:text-blue-600': tab === 'REGISTER',
                }"
                href="#"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                @click.prevent="tab = 'REGISTER'"
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'REGISTER',
                  'hover:text-blue-600': tab === 'LOGIN',
                }"
                href="#"
                >Register</a
              >
            </li>
          </ul>

          <LoginForm v-if="tab === 'LOGIN'" />

          <RegisterForm v-if="tab === 'REGISTER'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations, mapState } from "vuex";

import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default defineComponent({
  name: "AuthModal",

  components: {
    LoginForm,
    RegisterForm,
  },

  data() {
    return {
      tab: "LOGIN" as "LOGIN" | "REGISTER",
    };
  },

  computed: {
    // Use mapState when simply retriving a state value, mapState generates simple getters that return the state
    // use MapGetters when performing a computation with a state value
    // ...mapState({
    //   isModalOpen: "authModalShow", // Alias 'isModalOpen' for 'authModalShow' state
    // }),
    ...mapState(["authModalShow"]),
    // ...mapGetters(["authModalShow"]), // Overkill since we don't do any computation with in the authModalShow getter
    // authModalShow() {
    //   return this.$store.getters.authModalShow;
    // },
  },

  methods: {
    ...mapMutations(["toggleAuthModal"]),
  },
});
</script>
