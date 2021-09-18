import { auth, usersCollection } from "@/includes/firebase";
import { SongWithId } from "@/types/Song";
import { createStore } from "vuex";
import { Howl } from "howler";
import { formatTime } from "@/includes/helpers";

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

export interface State {
  authModalShow: boolean;
  userLoggedIn: boolean;

  currentSong: SongWithId | null;
  sound: Howl | null;
  seek: string;
  duration: string;
  playerProgress: string;
}

export default createStore<State>({
  state: {
    authModalShow: false,
    userLoggedIn: false,

    currentSong: null,
    sound: null,
    seek: "0:00",
    duration: "0:00",
    playerProgress: "0%",
  },

  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow;
    },

    toggleAuthentication(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },

    playNewSong(state, song: SongWithId) {
      state.currentSong = song;
      state.sound = new Howl({
        src: [song.url],
        html5: true, // Use html5 audio api to fetch src instead of ajax, prevent cors error
      });
    },

    updateSoundPosition(state) {
      if (!state.sound) return;

      const seek = state.sound.seek();
      const duration = state.sound.duration();

      state.seek = formatTime(seek);
      state.duration = formatTime(duration);
      state.playerProgress = `${(seek / duration) * 100}%`;
    },
  },

  getters: {
    // authModalShow(state) {
    //   return state.authModalShow;
    // },

    isSongPlaying(state) {
      if (!state.sound) return false;

      return state.sound.playing();
    },
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

    async playNewSong({ commit, state, dispatch }, song: SongWithId) {
      // Pause the audio and remove from memory
      if (state.sound) state.sound.unload();

      commit("playNewSong", song);

      if (!state.sound) return;

      state.sound.play();
      state.sound.on("play", () => {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      });
    },

    async toggleAudio({ state }) {
      if (!state.sound) return;

      if (state.sound.playing()) {
        return state.sound.stop();
      }

      return state.sound.play();
    },

    progress({ commit, state, dispatch }) {
      if (!state.sound) return;

      commit("updateSoundPosition");

      if (!state.sound.playing()) return;

      // If song is still playing, keep dispathing progress action to update seek & duration
      requestAnimationFrame(() => {
        dispatch("progress");
      });
    },

    updateSeek({ state, dispatch }, evt: PointerEvent) {
      if (!state.sound) return;

      const clickX = evt.clientX;
      const {
        left: elementLeft,
        width: elementWidth,
      } = (evt.currentTarget as HTMLSpanElement).getBoundingClientRect(); // currentTarget always returns the element that the event listener attached on
      const newProgress = (clickX - elementLeft) / elementWidth;
      const newSeconds = state.sound.duration() * newProgress;

      // Update the seek
      state.sound.seek(newSeconds);

      // Continue the progress, which updates the progress bar ui
      state.sound.once("seek", () => {
        dispatch("progress");
      });
    },
  },

  modules: {},
});
