import { createStore } from "vuex";

import auth, { AuthState } from "@/store/modules/auth";
import player, { PlayerState } from "@/store/modules/player";

export interface State {
  auth: AuthState;
  player: PlayerState;
}

const store = createStore<State>({
  modules: {
    auth,
    player,
  },
});

export type AppStore = typeof store;

export default store;
