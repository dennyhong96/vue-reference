import { reactive, nextTick, ref } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep } from "lodash";
import fs from "fs";
import path from "path";

import Home from "@/views/Home.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";
import { SongWithId } from "@/types/Song";
import { Howl } from "howler";

jest.mock("@/includes/firebase", () => ({
  songsCollection: {
    orderBy() {
      return this;
    },
    limit() {
      return this;
    },
    startAfter() {
      return this;
    },
    doc() {
      return {
        get: this.get,
      };
    },
    async get() {
      return Array.from({ length: 3 }).map((ts, index) => {
        return {
          id: `test-id-${index}`,
          data() {
            return {
              uid: "test-uid",
              displayName: "test-user",
              originalName: `test-song-${index}`,
              modifiedName: `test-song-${index}`,
              genre: "test-genre",
              commentCount: 0,
              url: "",
            };
          },
        };
      });
    },
  },
}));

const getDefaultMountingtOptions = (): MountingOptions<any> => {
  return {
    global: {
      plugins: [i18n, router, VeeValidatePlugin],
      provide: {
        [storeKey as symbol]: createStore({
          modules: {
            auth: cloneDeep(AuthModule),
            player: cloneDeep(PlayerModule),
          },
        }),
      },
    },
  };
};

const mount = <T>(Component: T, mountingOptions: MountingOptions<any> = {}) => {
  return _mount<T>(Component, {
    ...getDefaultMountingtOptions(),
    ...mountingOptions,
  });
};

describe("Home.vue", () => {
  test("Display the correct song info", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(Home);

    await flushPromises();

    const songItems = wrapper.findAll('[data-test^="song-item-id"]');
    expect(songItems.length).toBe(3);
    expect(songItems[0].html()).toContain(`test-song-0`);
    expect(songItems[1].html()).toContain(`test-song-1`);
    expect(songItems[2].html()).toContain(`test-song-2`);
  });
});
