import { createStore } from "vuex";
import { Howl } from "howler";

import modules from "@/store/modules";
import { SongWithId } from "@/types/Song";

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

const store = createStore<State>({ modules });

export default store;
