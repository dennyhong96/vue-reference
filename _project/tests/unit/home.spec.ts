import { shallowMount } from "@vue/test-utils";

import Home from "@/views/Home.vue";
import SongItem from "@/components/SongItem.vue";
import { TEST_SONGS } from "./__mocks__";
import { Howl } from "howler";

// Mock firebase module
jest.mock("@/includes/firebase", () => {
  //
});

describe("Home.vue", () => {
  test("should render a list of songs", async () => {
    // Overwrite component setup method, prevent network request, pass in data directly
    if (Home.setup) {
      Home.setup = () => ({ songs: TEST_SONGS });
    }

    const wrapper = shallowMount(Home, {
      data() {
        return { songs: TEST_SONGS };
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

    // wrapper.element is the root DOM element of the component
    expect(wrapper.element).toMatchSnapshot();

    const items = wrapper.findAllComponents(SongItem); // Select all by component

    // Render the correct number of songs
    expect(items).toHaveLength(TEST_SONGS.length);

    // Render songs in the correct order
    items.forEach((itemWrapper, idx) => {
      expect(itemWrapper.props().song).toEqual(TEST_SONGS[idx]);
    });
  });
});
