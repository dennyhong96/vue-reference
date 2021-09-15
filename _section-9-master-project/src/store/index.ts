import { auth, usersCollection } from "@/includes/firebase";
import { createStore } from "vuex";

export interface RegisterFormFields {
  name: string;
  email: string;
  age: string;
  password: string;
  confirm_password: string;
  country: string;
  role: string;
  tos: string;
}

export interface LoginFormFields {
  email: string;
  password: string;
}

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },

  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow;
    },

    toggleAuthentication(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },

  getters: {
    // authModalShow(state) {
    //   return state.authModalShow;
    // },
  },

  actions: {
    async initLogin({ commit }) {
      const user = auth.currentUser;

      if (!user) return;

      commit("toggleAuthentication");
    },

    async register({ commit }, values: RegisterFormFields) {
      // Register with firebase auth
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      const {
        password: _p,
        confirm_password: _c,
        tos: _t,

        ...filteredData
      } = values;

      // Insert user into firestore
      await usersCollection.doc(userCredentials.user?.uid).set(filteredData);

      // Update profile display name
      await userCredentials.user?.updateProfile({ displayName: values.name });

      commit("toggleAuthentication");
    },

    async login({ commit }, values: LoginFormFields) {
      await auth.signInWithEmailAndPassword(values.email, values.password);

      commit("toggleAuthentication");
    },

    async signOut({ commit }) {
      await auth.signOut();

      commit("toggleAuthentication");
    },
  },

  modules: {},
});
