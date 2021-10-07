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

import Player from "@/components/Player.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";
import { SongWithId } from "@/types/Song";
import { Howl } from "howler";

let IS_PLAYING = false;
let SEEK = 0;

let MockHowl = jest.fn();

jest.mock("howler", () => ({
  Howl: function(...args: any[]) {
    return MockHowl(...args);
  },
}));

let mockPlay = jest.fn();
let mockStop = jest.fn();
let mockLoad = jest.fn();
let mockPlaying = jest.fn();
let mockDuration = jest.fn();
let mockSeek = jest.fn();
let mockOnce = jest.fn();

const songBase64 = fs.readFileSync(
  path.join(__dirname, "..", "__mocks__", "TEST.mp3"),
  { encoding: "base64" }
);

const mockSong: SongWithId = {
  id: "test-id",
  uid: "test-uid",
  displayName: "test-user",
  originalName: "test-song",
  modifiedName: "test-song",
  genre: "test-genre",
  commentCount: 0,
  url: songBase64,
};

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

const getBoundingClientRect = Element.prototype.getBoundingClientRect;

const mount = <T>(Component: T, mountingOptions: MountingOptions<any> = {}) => {
  return _mount<T>(Component, {
    ...getDefaultMountingtOptions(),
    ...mountingOptions,
  });
};

describe("Player.vue", () => {
  beforeEach(() => {
    IS_PLAYING = false;
    SEEK = 0;

    mockPlay = jest.fn().mockImplementation(function() {
      IS_PLAYING = true;
    });
    mockStop = jest.fn().mockImplementation(function() {
      IS_PLAYING = false;
    });
    mockLoad = jest.fn();
    mockPlaying = jest.fn().mockImplementation(function() {
      return IS_PLAYING;
    });
    mockDuration = jest.fn().mockImplementation(function() {
      return 180;
    });
    mockSeek = jest.fn().mockImplementation(function(newSeek) {
      if (newSeek) {
        SEEK = newSeek;
        return;
      }
      return SEEK;
    });
    mockOnce = jest.fn().mockImplementation(function(event, callback) {
      callback();
    });

    MockHowl = jest.fn().mockImplementation(() => ({
      play: mockPlay,
      load: mockLoad,
      playing: mockPlaying,
      stop: mockStop,
      duration: mockDuration,
      seek: mockSeek,
      once: mockOnce,
    }));

    Element.prototype.getBoundingClientRect = () => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => null,
    });
  });

  afterAll(() => {
    Element.prototype.getBoundingClientRect = getBoundingClientRect;
  });

  test("Display the correct song info", async () => {
    await router.push("/");
    await router.isReady();

    const store = createStore({
      modules: {
        auth: cloneDeep(AuthModule),
        player: {
          ...cloneDeep(PlayerModule),
          state: {
            // @ts-ignore
            ...cloneDeep(PlayerModule).state(),
            currentSong: mockSong,
            sound: new Howl({}),
            duration: "03:00",
          },
        },
      },
    });

    const wrapper = mount(Player, {
      global: {
        ...getDefaultMountingtOptions().global,
        provide: {
          [storeKey as symbol]: store,
        },
      },
    });

    expect(wrapper.html()).toContain(mockSong.modifiedName);
    expect(wrapper.html()).toContain(`(Uploaded by ${mockSong.displayName})`);

    const seekDisplay = wrapper.get('[data-test="seek"]');
    const durationDisplay = wrapper.get('[data-test="duration"]');

    expect(seekDisplay.html()).toContain("00:00");
    expect(durationDisplay.html()).toContain("03:00");
  });

  test("Should toggle play/pause, and seek", async () => {
    await router.push("/");
    await router.isReady();

    const store = createStore({
      modules: {
        auth: cloneDeep(AuthModule),
        player: {
          ...cloneDeep(PlayerModule),
          state: {
            // @ts-ignore
            ...cloneDeep(PlayerModule).state(),
            currentSong: mockSong,
            sound: new Howl({}),
          },
        },
      },
    });

    const wrapper = mount(Player, {
      global: {
        ...getDefaultMountingtOptions().global,
        provide: {
          [storeKey as symbol]: store,
        },
      },
    });

    Element.prototype.getBoundingClientRect = () => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => null,
    });

    const playButton = wrapper.get('[data-test="play-button"]');
    await playButton.trigger("click");
    expect(IS_PLAYING).toBe(true);

    await playButton.trigger("click");
    expect(IS_PLAYING).toBe(false);

    const scrubProgress = wrapper.get('[data-test="scrub-progress"]');
    const progressInner = wrapper.get('[data-test="progress-inner"]');

    await scrubProgress.trigger("click", { clientX: 100 });
    expect(SEEK).toBe(90);
    expect((progressInner.element as HTMLSpanElement).style.width).toBe("50%");

    await scrubProgress.trigger("click", { clientX: 50 });
    expect(SEEK).toBe(45);
    expect((progressInner.element as HTMLSpanElement).style.width).toBe("25%");
  });
});
