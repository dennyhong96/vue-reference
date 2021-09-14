import { App } from "vue";
import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  defineRule,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

// A custom plugin that registers VeeForm and VeeField components
export default {
  // Before vue runs the app, it runs the install method of the plugin
  install(app: App<Element>, options: { [key: string]: any }): void {
    // Registers components globally
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    // Register rules to use
    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minValue);
    defineRule("max_value", maxValue);
    defineRule("confirmed", confirmed); // Checks if value in current input matches another input
    defineRule("excluded", excluded); // Checks if value in current input matches another input
  },
};
