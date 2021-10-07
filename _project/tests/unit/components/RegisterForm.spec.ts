import { reactive, nextTick } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep } from "lodash";

import RegisterForm from "@/components/RegisterForm.vue";
import i18n from "@/includes/i18n";
import router from "@/router";
import { storeKey } from "@/store";
import AuthModule, { RegisterFormFields } from "@/store/modules/auth";
import PlayerModule from "@/store/modules/player";
import VeeValidatePlugin from "@/includes/validation";

let mockRegisterAction = jest.fn();
jest.mock("@/composables/useAuth", () =>
  jest.fn().mockImplementation(() => ({
    toggleAuthModal: jest.fn(),
    register: mockRegisterAction,
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

describe("RegisterForm.vue", () => {
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
    mockRegisterAction = jest.fn();
  });

  afterAll(() => {
    window.location = location;
  });

  test("Should show errors on submission when inputs are invalid", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(RegisterForm);

    const mockRegisterForm: RegisterFormFields = {
      name: "dh",
      email: "test",
      age: "17",
      password: "ab",
      confirm_password: "bc",
      country: "Antarctica",
      role: "Listener",
      tos: "",
    };

    const nameField = wrapper.get('[data-test="name-input"]');
    const emailField = wrapper.get('[data-test="email-input"]');
    const ageField = wrapper.get('[data-test="age-input"]');
    const passwordField = wrapper.get('[data-test="password-input"]');
    const confirmPasswordField = wrapper.get(
      '[data-test="confirm-password-input"]'
    );
    const countryField = wrapper.get('[data-test="country-input"]');
    const roleField = wrapper.get('[data-test="role-input"]');
    const tosField = wrapper.get('[data-test="tos-input"]');

    await nameField.setValue(mockRegisterForm.name);
    await emailField.setValue(mockRegisterForm.email);
    await ageField.setValue(mockRegisterForm.age);
    await passwordField.setValue(mockRegisterForm.password);
    await confirmPasswordField.setValue(mockRegisterForm.confirm_password);
    await countryField.setValue(mockRegisterForm.country);
    await roleField.setValue(mockRegisterForm.role);
    await tosField.setValue(mockRegisterForm.tos);
    await flushPromises();

    const form = wrapper.get("form");
    await form.trigger("submit");
    await flushPromises();

    expect(wrapper.find('[data-test="name-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="email-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="age-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="password-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="confirm-password-error"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[data-test="country-error"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="tos-error"]').exists()).toBe(true);

    expect(mockRegisterAction).not.toHaveBeenCalled();
  });

  test("Should submit when inputs are valid", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(RegisterForm);

    const mockRegisterForm: RegisterFormFields = {
      name: "Denny Hong",
      email: "test@test.com",
      age: "21",
      password: "test123",
      confirm_password: "test123",
      country: "USA",
      role: "Listener",
      tos: "1",
    };

    const nameField = wrapper.get('[data-test="name-input"]');
    const emailField = wrapper.get('[data-test="email-input"]');
    const ageField = wrapper.get('[data-test="age-input"]');
    const passwordField = wrapper.get('[data-test="password-input"]');
    const confirmPasswordField = wrapper.get(
      '[data-test="confirm-password-input"]'
    );
    const countryField = wrapper.get('[data-test="country-input"]');
    const roleField = wrapper.get('[data-test="role-input"]');
    const tosField = wrapper.get('[data-test="tos-input"]');

    await nameField.setValue(mockRegisterForm.name);
    await emailField.setValue(mockRegisterForm.email);
    await ageField.setValue(mockRegisterForm.age);
    await passwordField.setValue(mockRegisterForm.password);
    await confirmPasswordField.setValue(mockRegisterForm.confirm_password);
    await countryField.setValue(mockRegisterForm.country);
    await roleField.setValue(mockRegisterForm.role);
    await tosField.setValue(mockRegisterForm.tos);
    await flushPromises();

    const form = wrapper.get("form");
    await form.trigger("submit");
    await flushPromises();

    expect(wrapper.find('[data-test="name-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="email-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="age-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="password-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="confirm-password-error"]').exists()).toBe(
      false
    );
    expect(wrapper.find('[data-test="country-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="tos-error"]').exists()).toBe(false);

    expect(mockRegisterAction).toHaveBeenCalled();
    expect(mockRegisterAction).toHaveBeenCalledTimes(1);
    expect(mockRegisterAction).toHaveBeenCalledWith(mockRegisterForm);
  });
});
