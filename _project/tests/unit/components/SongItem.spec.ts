import { reactive, nextTick } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep } from "lodash";

import SongItem from "@/components/SongItem.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";
import { SongWithId } from "@/types/Song";

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
  test("should render properly", async () => {
    await router.push("/");
    await router.isReady();

    const mockSong: SongWithId = {
      id: "test-id",
      uid: "test-uid",
      displayName: "test-user",
      originalName: "test-song",
      modifiedName: "test-song",
      genre: "test-genre",
      commentCount: 0,
      url: "",
    };

    const wrapper = mount(SongItem, {
      props: {
        song: mockSong,
      },
    });

    expect(wrapper.html()).toContain(mockSong.modifiedName);
    expect(wrapper.html()).toContain(`Uploaded by - ${mockSong.displayName}`);
    expect(wrapper.get('[data-test="comments-count"]').html()).toContain(
      mockSong.commentCount
    );
    expect(
      (wrapper.get('[data-test="song-item-link"]').element as HTMLAnchorElement)
        .href
    ).toContain(`/songs/${mockSong.id}`);
  });
});
