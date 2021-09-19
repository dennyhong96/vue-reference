import { auth, usersCollection } from "@/includes/firebase";
import { ActionContext } from "vuex";

import { State } from "..";

export interface AuthState {
  authModalShow: boolean;
  userLoggedIn: boolean;
}

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

export const state: () => AuthState = () => ({
  authModalShow: false,
  userLoggedIn: false,
});

const getters = {
  // authModalShow(state: AuthState, _: any, rootState: State): boolean {
  //   return state.authModalShow;
  // },
};

const actions = {
  async initLogin({ commit }: ActionContext<AuthState, State>): Promise<void> {
    const user = auth.currentUser;

    if (!user) return;

    commit("toggleAuthentication");
  },

  async register(
    { commit }: ActionContext<AuthState, State>,
    values: RegisterFormFields
  ): Promise<void> {
    // Register with firebase auth
    const userCredentials = await auth.createUserWithEmailAndPassword(
      values.email,
      values.password
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirm_password, tos, ...filteredData } = values;

    // Insert user into firestore
    await usersCollection.doc(userCredentials.user?.uid).set(filteredData);

    // Update profile display name
    await userCredentials.user?.updateProfile({ displayName: values.name });

    commit("toggleAuthentication");
  },

  async login(
    { commit }: ActionContext<AuthState, State>,
    values: LoginFormFields
  ): Promise<void> {
    await auth.signInWithEmailAndPassword(values.email, values.password);

    commit("toggleAuthentication");
  },

  async signOut({ commit }: ActionContext<AuthState, State>): Promise<void> {
    await auth.signOut();

    commit("toggleAuthentication");
  },
};

const mutations = {
  toggleAuthModal(state: AuthState): void {
    state.authModalShow = !state.authModalShow;
  },

  toggleAuthentication(state: AuthState): void {
    state.userLoggedIn = !state.userLoggedIn;
  },
};

export default {
  namespaced: true, // This namespaces getters, actions, and mutations (state is automatically namespaced by default)
  state,
  getters,
  actions,
  mutations,
};
