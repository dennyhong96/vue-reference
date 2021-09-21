import { shallowMount } from "@vue/test-utils";

import Home from "@/views/Home.vue";
import SongItem from "@/components/SongItem.vue";

// Mock firebae
jest.mock("@/includes/firebase", () => {
  //
});

describe("Home.vue", () => {
  test("should render a list of songs", () => {
    const songs = [
      { modifiedName: "test-1" },
      { modifiedName: "test-2" },
      { modifiedName: "test-3" },
    ];

    // Overwrite component methods, prevent network request
    if (Home.methods) {
      Home.methods.listSongs = () => false;
    }

    const wrapper = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          // Mock $t globally
          $t(str: string) {
            return str;
          },
        },
      },
    });

    const items = wrapper.findAllComponents(SongItem); // Select all by component

    // Render the correct number of songs
    expect(items).toHaveLength(songs.length);

    // Render songs in the correct order
    items.forEach((itemWrapper, idx) => {
      expect(itemWrapper.props().song).toEqual(songs[idx]);
    });
  });
});
