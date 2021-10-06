import { reactive } from "vue";
import { createStore } from "vuex";
import { mount as _mount, MountingOptions } from "@vue/test-utils";
import { cloneDeep } from "lodash";

import AppHeader from "@/components/AppHeader.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";

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

describe("AppHeader.vue", () => {
  test("Should not render Manage Link when user is not logged in", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AppHeader);

    expect(wrapper.get('[data-test="auth-link"]')).toBeTruthy();
    expect(wrapper.find('[data-test="manage-link"]').exists()).toBe(false);
  });

  test("Should not render Auth Link when user is logged in", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        ...getDefaultMountingtOptions().global,
        provide: {
          [storeKey as symbol]: createStore({
            modules: {
              auth: cloneDeep({
                ...AuthModule,
                state: {
                  ...AuthModule.state,
                  userLoggedIn: true,
                },
              }),
              player: cloneDeep(PlayerModule),
            },
          }),
        },
      },
    });

    expect(wrapper.find('[data-test="auth-link"]').exists()).toBe(false);
    expect(wrapper.get('[data-test="manage-link"]')).toBeTruthy();
  });

  test("Click on auth link should toggle userLoggedIn state", async () => {
    await router.push("/");
    await router.isReady();

    const mockAuthState = reactive({ authModalShow: false });

    const wrapper = mount(AppHeader, {
      global: {
        ...getDefaultMountingtOptions().global,
        provide: {
          [storeKey as symbol]: createStore({
            modules: {
              auth: {
                ...cloneDeep(AuthModule),
                state: mockAuthState,
              },
              player: cloneDeep(PlayerModule),
            },
          }),
        },
      },
    });

    const authLink = wrapper.get('[data-test="auth-link"]');
    await authLink.trigger("click");
    expect(mockAuthState.authModalShow).toBe(true);
  });

  test("Language selector should change locale", async () => {
    const wrapper = mount(AppHeader);

    // Locale should be 'en' by default
    expect(wrapper.vm.locale).toBe("en");

    const localeSelector = wrapper.get("select");
    await localeSelector.setValue("fr");
    expect(wrapper.vm.locale).toBe("fr");

    await localeSelector.setValue("zh");
    expect(wrapper.vm.locale).toBe("zh");

    await localeSelector.setValue("en");
    expect(wrapper.vm.locale).toBe("en");
  });
});
