import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItem from "@/components/SongItem.vue";
import { TEST_SONG } from "./__mocks__";

describe("SongItem.vue", () => {
  test("should render display name of the song author", () => {
    const wrapper = shallowMount(SongItem, {
      props: { song: TEST_SONG },
      global: {
        components: {
          "router-link": RouterLinkStub, // Stub a 'fake' router-link component without actual functionality
        },
      },
    });

    const songAuthor = wrapper.find("span.text-gray-500.text-sm");
    expect(songAuthor.text()).toBe(TEST_SONG.displayName);
    // expect(songAuthor.text() === TEST_SONG.displayName).toBe(false); // Avoid boolean asertions
  });

  test("should render the correct song id attribute", () => {
    const wrapper = shallowMount(SongItem, {
      props: { song: TEST_SONG },
      global: {
        components: {
          "router-link": RouterLinkStub, // Stub a 'fake' router-link component without actual functionality
        },
      },
    });

    // Retrive attributs on the root element
    expect(wrapper.attributes("id")).toBe(`song-id-${TEST_SONG.id}`);
    expect(wrapper.classes()).toContain(`example-${TEST_SONG.id}`);
  });
});
