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
import { defineComponent, reactive, toRefs } from "vue";

import { LoginFormFields } from "@/store/modules/auth";
import useAuth from "@/composables/useAuth";

interface LoginFormState {
  loginValidationSchema: {
    email: string;
    password: string;
  };

  loginInProgress: boolean; // to disable submit button
  loginShowAlert: boolean; // toggle showing the alert
  loginAlertVariant: string; // for alert background color
  loginAlertMessage: string; // for alert message
}

export default defineComponent({
  name: "LoginForm",

  setup() {
    const state = reactive<LoginFormState>({
      loginValidationSchema: {
        email: "required|email",
        password: "required|min:3|max:32",
      },

      loginInProgress: false,
      loginShowAlert: false,
      loginAlertVariant: "bg-blue-500",
      loginAlertMessage: "Please wait! Login in progress.",
    });

    const { toggleAuthModal, login: loginAction } = useAuth();

    const login = async (values: LoginFormFields) => {
      state.loginInProgress = true;
      state.loginShowAlert = true;
      state.loginAlertVariant = "bg-blue-500";

      try {
        await loginAction(values);

        state.loginAlertVariant = "bg-green-500";
        state.loginAlertMessage = "Successs! Your are not logged in.";

        window.location.reload();
        // state.toggleAuthModal();
      } catch (error) {
        state.loginInProgress = false;
        state.loginAlertVariant = "bg-red-500";
        state.loginAlertMessage =
          (error as Error).message ??
          "An unexpeced error occured. Please try again later.";
      }
    };

    return {
      ...toRefs(state),

      // Mutation
      toggleAuthModal,

      // Actions
      login,
    };
  },
});
</script>
