import { reactive, nextTick } from "vue";
import { createStore } from "vuex";
import { mount as _mount, MountingOptions } from "@vue/test-utils";
import { cloneDeep } from "lodash";

import AuthModal from "@/components/AuthModal.vue";
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

describe("AuthModal.vue", () => {
  test("Should show and hide", async () => {
    await router.push("/");
    await router.isReady();

    const mockAuthState = reactive({ authModalShow: false });

    const wrapper = mount(AuthModal, {
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

    // Should be hidden by default
    expect(wrapper.get("#modal").classes()).toContain("hidden");

    mockAuthState.authModalShow = true;
    await nextTick();
    expect(wrapper.get("#modal").classes()).not.toContain("hidden");

    mockAuthState.authModalShow = false;
    await nextTick();
    expect(wrapper.get("#modal").classes()).toContain("hidden");
  });

  test("Should toggle between register and login forms", async () => {
    await router.push("/");
    await router.isReady();

    const mockAuthState = reactive({ authModalShow: false });

    const wrapper = mount(AuthModal, {
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

    // Should be hidden by default
    expect(wrapper.get("#modal").classes()).toContain("hidden");

    mockAuthState.authModalShow = true;
    await nextTick();
    expect(wrapper.get("#modal").classes()).not.toContain("hidden");

    const closeModalButton = wrapper.get('[data-test="close-modal-button"]');
    await closeModalButton.trigger("click");
    expect(wrapper.get("#modal").classes()).toContain("hidden");
  });

  test("Should toggle between register and login forms", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AuthModal);

    // Login form should show by default
    expect(wrapper.getComponent({ name: "LoginForm" })).toBeTruthy();
    expect(wrapper.findComponent({ name: "RegisterForm" }).exists()).toBe(
      false
    );

    const registerLink = wrapper.get('[data-test="register-link"]');
    await registerLink.trigger("click");

    expect(wrapper.findComponent({ name: "LoginForm" }).exists()).toBe(false);
    expect(wrapper.getComponent({ name: "RegisterForm" })).toBeTruthy();

    const loginLink = wrapper.get('[data-test="login-link"]');
    await loginLink.trigger("click");

    expect(wrapper.getComponent({ name: "LoginForm" })).toBeTruthy();
    expect(wrapper.findComponent({ name: "RegisterForm" }).exists()).toBe(
      false
    );
  });
});
