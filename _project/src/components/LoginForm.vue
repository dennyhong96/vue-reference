<template>
  <!-- Login alert -->
  <div
    v-if="loginShowAlert"
    class="text-white text-center font-bold p-5 mb-4"
    :class="loginAlertVariant"
  >
    {{ loginAlertMessage }}
  </div>

  <!-- Login Form -->
  <VeeForm :validation-schema="loginValidationSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      :disabled="loginInProgress"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>

<script lang="ts">
import { LoginFormFields } from "@/store/modules/auth";
import { defineComponent } from "vue";
import { mapMutations } from "vuex";

export default defineComponent({
  name: "LoginForm",

  data() {
    return {
      loginValidationSchema: {
        email: "required|email",
        password: "required|min:3|max:32",
      },

      loginInProgress: false, // to disable submit button
      loginShowAlert: false, // toggle showing the alert
      loginAlertVariant: "bg-blue-500", // for alert background color
      loginAlertMessage: "Please wait! Login in progress.", // for alert message
    };
  },

  computed: {},

  methods: {
    ...mapMutations("auth", ["toggleAuthModal"]),

    async login(values: LoginFormFields) {
      this.loginInProgress = true;
      this.loginShowAlert = true;
      this.loginAlertVariant = "bg-blue-500";

      try {
        await this.$store.dispatch("auth/login", values);

        this.loginAlertVariant = "bg-green-500";
        this.loginAlertMessage = "Successs! Your are not logged in.";

        window.location.reload();
        // this.toggleAuthModal();
      } catch (error) {
        this.loginInProgress = false;
        this.loginAlertVariant = "bg-red-500";
        this.loginAlertMessage =
          error.message ??
          "An unexpeced error occured. Please try again later.";
      }
    },
  },
});
</script>
