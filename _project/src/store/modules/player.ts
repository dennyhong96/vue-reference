import { ActionContext } from "vuex";
import { Howl } from "howler";

import { PlayerState, State } from "..";
import { SongWithId } from "@/types/Song";
import { formatTime } from "@/includes/helpers";

export const state: () => PlayerState = () => ({
  currentSong: null,
  sound: null,
  seek: "0:00",
  duration: "0:00",
  playerProgress: "0%",
});

// getters
const getters = {
  isSongPlaying(state: PlayerState): boolean {
    if (!state.sound) return false;
    return state.sound.playing();
  },
};

// actions
const actions = {
  playNewSong(
    { commit, state, dispatch }: ActionContext<PlayerState, State>,
    song: SongWithId
  ): void {
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

  toggleAudio({ state }: ActionContext<PlayerState, State>): void {
    if (!state.sound) return;

    if (state.sound.playing()) {
      state.sound.stop();
      return;
    }

    state.sound.play();
    return;
  },

  progress({
    commit,
    state,
    dispatch,
  }: ActionContext<PlayerState, State>): void {
    if (!state.sound) return;

    commit("updateSoundPosition");

    if (!state.sound.playing()) return;

    // If song is still playing, keep dispathing progress action to update seek & duration
    requestAnimationFrame(() => {
      dispatch("progress");
    });
  },

  updateSeek(
    { state, dispatch }: ActionContext<PlayerState, State>,
    evt: MouseEvent
  ): void {
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
};

// mutations
const mutations = {
  playNewSong(state: PlayerState, song: SongWithId): void {
    state.currentSong = song;
    state.sound = new Howl({
      src: [song.url],
      html5: true, // Use html5 audio api to fetch src instead of ajax, prevent cors error
    });
  },

  updateSoundPosition(state: PlayerState): void {
    if (!state.sound) return;

    const seek = state.sound.seek();
    const duration = state.sound.duration();

    state.seek = formatTime(seek);
    state.duration = formatTime(duration);
    state.playerProgress = `${(seek / duration) * 100}%`;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
