import { createStore } from "vuex";
import _ from "lodash";

import auth from "@/store/modules/auth";
import player from "@/store/modules/player";
import { Howl } from "howler";

// Mock firebase module
jest.mock("@/includes/firebase", () => ({
  auth: {
    // Make sure to resolve/reject when mocking a promise
    signInWithEmailAndPassword() {
      return Promise.resolve();
    },
  },
}));

describe("VueX Store", () => {
  test("toggleAuthentication mutation sets userLoggedIn to true", () => {
    const store = createStore({ modules: { auth: _.cloneDeep(auth) } }); // Use cloneDeep to avoid state from leaking between tests

    expect(store.state.auth.userLoggedIn).toBe(false);

    store.commit("auth/toggleAuthentication");
    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  test("login action sets userLoggedIn to true", async () => {
    expect.assertions(2); // Jest will not pass the test until 2 assetions are made

    const store = createStore({ modules: { auth: _.cloneDeep(auth) } });

    expect(store.state.auth.userLoggedIn).toBe(false);

    await store.dispatch("auth/login", {
      email: "test-email",
      password: "test-password",
    });

    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  test("isSongPlaying getter returns true when the audio is playing", async () => {
    const mockState = {
      sound: { playing: () => true } as Howl,
      currentSong: null,
      seek: "0:00",
      duration: "0:00",
      playerProgress: "0%",
    };

    const result = player.getters.isSongPlaying(mockState);
    expect(result).toBe(true);

    mockState.sound.playing = () => false;

    const result2 = player.getters.isSongPlaying(mockState);
    expect(result2).toBe(false);
  });
});
