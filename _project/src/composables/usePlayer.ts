import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { Howl } from "howler";

import { State } from "@/store";
import { SongWithId } from "@/types/Song";

const usePlayer: () => {
  currentSong: ComputedRef<SongWithId | null>;
  sound: ComputedRef<Howl | null>;
  seek: ComputedRef<string>;
  duration: ComputedRef<string>;
  playerProgress: ComputedRef<string>;
  isSongPlaying: ComputedRef<boolean>;
  playNewSong: (song: SongWithId | null) => void;
  toggleAudio: () => void;
  updateSeek: (evt: MouseEvent) => void;
} = () => {
  const store = useStore<State>();

  // State
  const currentSong = computed(() => store.state.player.currentSong);
  const sound = computed(() => store.state.player.sound);
  const seek = computed(() => store.state.player.seek);
  const duration = computed(() => store.state.player.duration);
  const playerProgress = computed(() => store.state.player.playerProgress);

  // Getter
  const isSongPlaying = computed<boolean>(
    () => store.getters["player/isSongPlaying"]
  );

  // Actions
  const playNewSong = (song: SongWithId | null) => {
    if (!song) return;
    store.dispatch("player/playNewSong", song);
  };
  const toggleAudio = () => {
    store.dispatch("player/toggleAudio");
  };
  const updateSeek = (evt: MouseEvent) => {
    store.dispatch("player/updateSeek", evt);
  };

  return {
    currentSong,
    sound,
    seek,
    duration,
    playerProgress,

    isSongPlaying,

    playNewSong,
    toggleAudio,
    updateSeek,
  };
};

export default usePlayer;
