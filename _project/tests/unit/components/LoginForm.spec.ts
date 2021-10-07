import { reactive, nextTick } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep } from "lodash";

import LoginForm from "@/components/LoginForm.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";

let mockLoginAction = jest.fn();
jest.mock("@/composables/useAuth", () =>
  jest.fn().mockImplementation(() => ({
    toggleAuthModal: jest.fn(),
    login: mockLoginAction,
  }))
);

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

let location: Location;

describe("LoginForm.vue", () => {
  beforeAll(() => {
    location = window.location;
    // @ts-ignore
    delete window.location;
    window.location = {
      ...location,
      reload: jest.fn(),
    };
  });

  beforeEach(() => {
    mockLoginAction = jest.fn();
  });

  afterAll(() => {
    window.location = location;
  });

  test("Should show errors on submission when inputs are invalid", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(LoginForm);

    const mockLoginInfo = {
      email: "test", // not an email
      password: "12", // too short
    };

    const emailInput = wrapper.get('[data-test="email-input"]');
    const passwordInput = wrapper.get('[data-test="password-input"]');
    await emailInput.setValue(mockLoginInfo.email);
    await passwordInput.setValue(mockLoginInfo.password);
    await flushPromises();

    const form = wrapper.get("form");
    await form.trigger("submit");
    await flushPromises();

    expect(wrapper.find('[data-test="password-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="email-error"]').exists()).toBe(true);
    expect(mockLoginAction).not.toHaveBeenCalled();
  });

  test("Should submit when inputs are valid", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(LoginForm);

    const mockLoginInfo = {
      email: "test@test.com",
      password: "test123",
    };

    const emailInput = wrapper.get('[data-test="email-input"]');
    const passwordInput = wrapper.get('[data-test="password-input"]');
    await emailInput.setValue(mockLoginInfo.email);
    await passwordInput.setValue(mockLoginInfo.password);
    await flushPromises();

    const form = wrapper.get("form");
    await form.trigger("submit");
    await flushPromises();

    expect(wrapper.find('[data-test="password-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="email-error"]').exists()).toBe(false);

    expect(mockLoginAction).toHaveBeenCalled();
    expect(mockLoginAction).toHaveBeenCalledTimes(1);
    expect(mockLoginAction).toHaveBeenCalledWith(mockLoginInfo);
  });
});
