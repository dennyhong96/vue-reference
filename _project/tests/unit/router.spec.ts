import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItem from "@/components/SongItem.vue";
import { TEST_SONG } from "./__mocks__";

describe("Router", () => {
  test("Renders correct router link", () => {
    const wrapper = shallowMount(SongItem, {
      props: { song: TEST_SONG },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    // The 'to' prop is passed down to <router-link/> as a prop, stubbed with RouterLinkStub
    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "Song",
      params: { id: TEST_SONG.id },
    });
  });
});
