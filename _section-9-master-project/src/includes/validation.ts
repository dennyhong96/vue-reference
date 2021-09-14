import { App } from "vue";
import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  defineRule,
  configure,
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

    // Register rules to

    // Generic rules
    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minValue);
    defineRule("max_value", maxValue);
    defineRule("excluded", excluded); // Checks if value in current input matches another input

    // Specific rules, for configuring more descriptive error message
    defineRule("tos", required);
    defineRule("passwords_mismatch", confirmed); // Checks if value in current input matches another input
    defineRule("country_excluded", excluded); // A rule specifically for country, so we can give more descriptive error message

    // Configure the default behavior
    configure({
      generateMessage(ctx) {
        // console.log({ ctx });

        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} can only contain alphabetic characters and spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for ${ctx.field}.`,
          country_excluded: `Due to restrictions, we do not accept users from this location.`,
          passwords_mismatch: `The passwords don't match.`,
          tos: `You must accept the terms of service.`,
        };

        let message = `The field ${ctx.field} is invalid.`;
        if (ctx.rule?.name && ctx.rule.name in messages) {
          message = messages[ctx.rule.name as keyof typeof messages];
        }

        return message;
      },

      // Validation triggers
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false, // Validate on every key stroke
      validateOnModelUpdate: true, // Validate on v-model value change
    });
  },
};
