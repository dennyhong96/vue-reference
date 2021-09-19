import _ from "lodash";
import { Plugin } from "vue";

// Automatically register all common components globally
const globalComponentsPlugin: Plugin = {
  install(app) {
    const commonComponents = require.context(
      "../components/common",
      true,
      /[A-Za-z0-9-_,\s]+\.vue$/i
    );

    commonComponents.keys().forEach((fileName) => {
      const componentConfig = commonComponents(fileName);

      // Derive component name from filename. e.g. './Button.vue' -> 'Button', './Alert.vue' -> 'Alert'
      const componentName = _.upperFirst(
        _.camelCase(
          // Remove './' at the beginnng of filename and '.vue' extension at the end
          fileName.replace(/^\.\//, "").replace(/\.\w+$/, "")
        )
      );

      // console.log({ componentConfig });
      // console.log({ fileName });
      // console.log({ componentName });

      app.component(
        `App${componentName}`, // Prefix component names to avoid conflict
        componentConfig.default ?? componentConfig // Account for both default export or named export
      );
    });
  },
};

export default globalComponentsPlugin;
