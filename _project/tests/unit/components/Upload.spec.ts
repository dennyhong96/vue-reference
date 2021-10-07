import { reactive, nextTick } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep } from "lodash";
import fs from "fs";
import path from "path";

import Upload from "@/components/Upload.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";
import { SongWithId } from "@/types/Song";
import { file } from "@babel/types";

let mockSet = jest.fn();
jest.mock("@/includes/firebase.ts", () => ({
  storage: {
    ref() {
      return {
        child() {
          return {
            put() {
              return {
                // @ts-ignore
                async on(event, onSnapshot, onError, onComplete) {
                  onSnapshot({
                    bytesTransferred: 99,
                    totalBytes: 100,
                  });

                  setTimeout(() => {
                    onComplete();
                  }, 500);
                },
                snapshot: {
                  ref: {
                    async getDownloadURL() {
                      return "mock-download-url";
                    },
                  },
                },
              };
            },
          };
        },
      };
    },
  },
  auth: {
    currentUser: {
      uid: "test-user",
      displayName: "Test User",
    },
  },
  songsCollection: {
    doc(id?: string) {
      if (!id) {
        return {
          id: "test-song-id",
        };
      } else {
        return {
          set: mockSet,
        };
      }
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

describe("SongItem.vue", () => {
  beforeEach(() => {
    mockSet = jest.fn();
  });

  test("Should upload files on drop", async () => {
    await router.push("/");
    await router.isReady();

    const songBase64 = fs.readFileSync(
      path.join(__dirname, "..", "__mocks__", "SEJODIOTO.mp3")
    );
    const songBlob = new Blob((songBase64 as any) as BlobPart[]);
    const mockFile = new File([songBlob], "test.mp3", {
      type: "audio/mpeg",
    });

    const handleCreateLocalSong = jest.fn();
    const wrapper = mount(Upload, {
      props: {
        handleCreateLocalSong,
      },
    });

    const dropSongBox = wrapper.get('[data-test="drop-song-box"]');
    await dropSongBox.trigger("drop", {
      dataTransfer: {
        files: [mockFile],
      },
    });

    expect(wrapper.find('[data-test="progress-bar"]').exists()).toBe(true);

    // Wait for mock upload to finish
    setTimeout(() => {
      expect(mockSet).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith({
        uid: "test-user",
        displayName: "Test User",
        originalName: "test.mp3",
        modifiedName: "test.mp3",
        genre: "",
        commentCount: 0,
        url: "mock-download-url",
      });

      expect(handleCreateLocalSong).toHaveBeenCalled();
      expect(handleCreateLocalSong).toHaveBeenCalledWith({
        id: "mock-song-id",
        uid: "test-user",
        displayName: "Test User",
        originalName: "test.mp3",
        modifiedName: "test.mp3",
        genre: "",
        commentCount: 0,
        url: "mock-download-url",
      });
    }, 500);
  });
});
