import { computed, ComputedRef } from "vue";

import useStore from "@/composables/useStore";
import { LoginFormFields, RegisterFormFields } from "@/store/modules/auth";

const useAuth: () => {
  authModalShow: ComputedRef<boolean>;
  userLoggedIn: ComputedRef<boolean>;
  initLogin: () => Promise<void>;
  register: (values: RegisterFormFields) => Promise<void>;
  login: (values: LoginFormFields) => Promise<void>;
  signOut: () => Promise<void>;
  toggleAuthModal: () => void;
} = () => {
  const store = useStore();

  // State
  const authModalShow = computed(() => store.state.auth.authModalShow);
  const userLoggedIn = computed(() => store.state.auth.userLoggedIn);

  // Actions
  const initLogin = async () => {
    await store.dispatch("auth/initLogin");
  };
  const register = async (values: RegisterFormFields) => {
    await store.dispatch("auth/register", values);
  };
  const login = async (values: LoginFormFields) => {
    await store.dispatch("auth/login", values);
  };
  const signOut = async () => {
    await store.dispatch("auth/signOut");
  };

  // Mutations
  const toggleAuthModal = () => store.commit("auth/toggleAuthModal");

  return {
    authModalShow,
    userLoggedIn,

    initLogin,
    register,
    login,
    signOut,

    toggleAuthModal,
  };
};

export default useAuth;
