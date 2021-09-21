import { shallowMount } from "@vue/test-utils";

import About from "@/views/About.vue";

describe("About.vue", () => {
  test("should render inner text", () => {
    // mount() converts component options object into a consructor function,
    // then creates an instance out of the constructor funciton,
    // then mount the instance
    const wrapper = shallowMount(About); // shallow mount limits to one level of children

    expect(wrapper.text()).toContain("about");
  });
});
