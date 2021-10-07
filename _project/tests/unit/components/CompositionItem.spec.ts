import { reactive, nextTick } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep, update } from "lodash";
import fs from "fs";
import path from "path";

import CompositionItem from "@/components/CompositionItem.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";
import { SongWithId } from "@/types/Song";

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

let mockStorageDelete = jest.fn();
let mockSongsCollectionDelete = jest.fn();
let mockSongsCollectionUpdate = jest.fn();
jest.mock("@/includes/firebase.ts", () => ({
  storage: {
    ref() {
      return {
        child() {
          return {
            async delete() {
              mockStorageDelete();
            },
          };
        },
      };
    },
  },
  songsCollection: {
    doc() {
      return {
        async delete() {
          mockSongsCollectionDelete();
        },
        async update(...args: any[]) {
          mockSongsCollectionUpdate(...args);
        },
      };
    },
  },
}));
let handleUpdateLocalSongs = jest.fn();
let handleDeleteLocalSong = jest.fn();
let handleUpdateHasUnsavedForm = jest.fn();

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
    mockStorageDelete = jest.fn();
    mockSongsCollectionDelete = jest.fn();
    mockSongsCollectionUpdate = jest.fn();

    handleUpdateLocalSongs = jest.fn();
    handleDeleteLocalSong = jest.fn();
    handleUpdateHasUnsavedForm = jest.fn();
  });

  test("Should delete composition item", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CompositionItem, {
      props: {
        song: mockSong,
        handleUpdateLocalSongs,
        handleDeleteLocalSong,
        handleUpdateHasUnsavedForm,
      },
    });

    const deleteButton = wrapper.get('[data-test="delete-button"]');
    await deleteButton.trigger("click");

    expect(handleDeleteLocalSong).toHaveBeenCalled();
    expect(handleDeleteLocalSong).toHaveBeenCalledTimes(1);
    expect(handleDeleteLocalSong).toHaveBeenCalledWith(mockSong.id);
  });

  test("Should toggle show and hide the form", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CompositionItem, {
      props: {
        song: mockSong,
        handleUpdateLocalSongs,
        handleDeleteLocalSong,
        handleUpdateHasUnsavedForm,
      },
    });

    // Form is hidden by default
    const editForm = wrapper.find('[data-test="edit-form"]');
    expect(editForm.isVisible()).toBe(false);

    const editFormToggler = wrapper.get('[data-test="edit-form-toggler"]');
    await editFormToggler.trigger("click");
    expect(editForm.isVisible()).toBe(true);

    await editFormToggler.trigger("click");
    expect(editForm.isVisible()).toBe(false);

    await editFormToggler.trigger("click");
    expect(editForm.isVisible()).toBe(true);

    // Click on the back button on the form should hide the form too
    const backButton = wrapper.get('[data-test="back-button"]');
    await backButton.trigger("click");
    expect(editForm.isVisible()).toBe(false);
  });

  test("Shouldn't update composition item when inputs are invalid", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CompositionItem, {
      props: {
        song: mockSong,
        handleUpdateLocalSongs,
        handleDeleteLocalSong,
        handleUpdateHasUnsavedForm,
      },
    });

    const editFormToggler = wrapper.get('[data-test="edit-form-toggler"]');
    await editFormToggler.trigger("click");

    const editForm = wrapper.find('[data-test="edit-form"]');
    expect(editForm.isVisible()).toBe(true);

    const songNameInput = wrapper.get('[data-test="song-name-input"]');
    expect((songNameInput.element as HTMLInputElement).value).toBe(
      mockSong.originalName
    );
    await songNameInput.setValue(""); // should be required

    const songGenreInput = wrapper.get('[data-test="song-genre-input"]');
    expect((songGenreInput.element as HTMLInputElement).value).toBe(
      mockSong.genre
    );
    await songGenreInput.setValue("invalid-genre"); // should be alpha spaces

    const form = wrapper.get("form");
    await form.trigger("submit");
    await flushPromises();

    expect(wrapper.find('[data-test="song-name-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="song-genre-error"]').exists()).toBe(true);

    expect(mockSongsCollectionUpdate).not.toHaveBeenCalled();
    expect(handleUpdateLocalSongs).not.toHaveBeenCalled();
  });

  test("Should update composition item when inputs are valid", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CompositionItem, {
      props: {
        song: mockSong,
        handleUpdateLocalSongs,
        handleDeleteLocalSong,
        handleUpdateHasUnsavedForm,
      },
    });

    const editFormToggler = wrapper.get('[data-test="edit-form-toggler"]');
    await editFormToggler.trigger("click");

    const editForm = wrapper.find('[data-test="edit-form"]');
    expect(editForm.isVisible()).toBe(true);

    const songNameInput = wrapper.get('[data-test="song-name-input"]');
    expect((songNameInput.element as HTMLInputElement).value).toBe(
      mockSong.originalName
    );
    await songNameInput.setValue("modifiedSongName");

    const songGenreInput = wrapper.get('[data-test="song-genre-input"]');
    expect((songGenreInput.element as HTMLInputElement).value).toBe(
      mockSong.genre
    );
    await songGenreInput.setValue("modifiedGenre");

    const form = wrapper.get("form");
    await form.trigger("submit");
    await flushPromises();

    expect(mockSongsCollectionUpdate).toHaveBeenCalled();
    expect(mockSongsCollectionUpdate).toHaveBeenCalledTimes(1);
    expect(mockSongsCollectionUpdate).toHaveBeenCalledWith({
      modifiedName: "modifiedSongName",
      genre: "modifiedGenre",
    });

    expect(handleUpdateLocalSongs).toHaveBeenCalled();
    expect(handleUpdateLocalSongs).toHaveBeenCalledTimes(1);
    expect(handleUpdateLocalSongs).toHaveBeenCalledWith({
      id: mockSong.id,
      modifiedName: "modifiedSongName",
      genre: "modifiedGenre",
    });
  });
});
