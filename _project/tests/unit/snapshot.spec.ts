import { RouterLinkStub, shallowMount } from "@vue/test-utils";

import SongItem from "@/components/SongItem.vue";
import { TEST_SONG } from "./__mocks__";

describe("Snapshot SongItem.vue", () => {
  test("Renders correctly", () => {
    const wrapper = shallowMount(SongItem, {
      props: {
        song: TEST_SONG,
      },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    // wrapper.element is the root DOM element of the component
    expect(wrapper.element).toMatchSnapshot();
  });
});
