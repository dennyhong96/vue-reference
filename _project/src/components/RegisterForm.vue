<template>
  <!-- Register alret -->
  <div
    v-if="registerShowAlert"
    class="text-white text-center font-bold p-5 mb-4"
    :class="registerAlertVariant"
  >
    {{ registerAlertMessage }}
  </div>

  <!-- Registration Form -->
  <!-- VeeForm, VeeField, and ErrorMessage is registered globally in the validation plugin -->
  <!-- register submit handler will not be called if any of the VeeFields in VeeForm is not valid -->
  <VeeForm
    :validation-schema="registerValidationSchema"
    :initial-values="defaultFormData"
    @submit="register"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <!-- :bails="false" tells VeeField not to use early exit strategy for validation on this field -->
      <!-- using :bails="false", we can output multiple errors -->
      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          v-bind="field"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <div v-for="error in errors" :key="error" class="text-red-600">
          {{ error }}
        </div>
      </VeeField>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <div class="mb-3">
      <label class="inline-block mb-2">Role</label>
      <VeeField
        as="select"
        name="role"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Listener">Listener</option>
        <option value="Artist">Artist</option>
      </VeeField>
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <!-- Be default VeeField has undefined as value, must specify value="1" otherwise the rules will be broken -->
      <VeeField
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />

      <!-- Component interpolation - insert HTML into a translation -->
      <!-- The wrapped HTML content replaces the {0} in locale files -->
      <i18n-t keypath="register.accept" tag="label" class="inline-block">
        <a href="/">{{ $t("register.TOS") }}</a>
      </i18n-t>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button
      :disabled="registerInProgress"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { RegisterFormFields } from "@/store";
import { mapMutations } from "vuex";

export default defineComponent({
  name: "AuthModal",

  data() {
    return {
      // Initial values for the form
      defaultFormData: {
        country: "USA",
        role: "Listener",
      },

      // Validation schema specify the rules to use for fields
      registerValidationSchema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:3|max:32",
        confirm_password: "passwords_mismatch:@password", // Make sure value in confirm_password matches password
        country: "required|country_excluded:Antarctica",
        role: "required",
        tos: "tos", // Must agree to terms and confition, must check the checkbox
      },

      registerInProgress: false,
      registerShowAlert: false,
      registerAlertVariant: "bg-blue-500",
      registerAlertMessage: "Please wait! Your account is being created.",
    };
  },

  computed: {},

  methods: {
    ...mapMutations(["toggleAuthModal"]),

    async register(values: RegisterFormFields) {
      this.registerInProgress = true;
      this.registerShowAlert = true;
      this.registerAlertVariant = "bg-blue-500";
      this.registerAlertMessage = "Please wait! Your account is being created.";

      try {
        await this.$store.dispatch("register", values);

        this.registerAlertVariant = "bg-green-500";
        this.registerAlertMessage = "Successs! Your account has been created.";

        window.location.reload();
        // this.toggleAuthModal();
      } catch (error) {
        this.registerInProgress = false;
        this.registerAlertVariant = "bg-red-500";
        this.registerAlertMessage =
          error.message ??
          "An unexpeced error occured. Please try again later.";
      }
    },
  },
});
</script>
