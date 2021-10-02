import { createStore, createLogger } from "vuex";
import { Howl } from "howler";
import { InjectionKey } from "vue";

import modules from "@/store/modules";
import { SongWithId } from "@/types/Song";

export const storeKey: InjectionKey<AppStore> = Symbol();

export interface AuthState {
  authModalShow: boolean;
  userLoggedIn: boolean;
}

export interface PlayerState {
  currentSong: SongWithId | null;
  sound: Howl | null;
  seek: string;
  duration: string;
  playerProgress: string;
}

export interface DummyState {
  foo: string;
}

export interface State {
  auth: AuthState;
  player: PlayerState;
  dummy: DummyState;
}

export type AppStore = typeof store;

const store = createStore<State>({
  modules,
  plugins: process.env.NODE_ENV === "production" ? [] : [createLogger()],
  strict: process.env.NODE_ENV !== "production",
});

export default store;
