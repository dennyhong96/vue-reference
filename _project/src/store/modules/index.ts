import _ from "lodash";

// Automatically register vuex modules
const requireModule = require.context(".", true, /\.ts$/i);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modules: { [key: string]: any } = {};

requireModule.keys().forEach((fileName) => {
  if (["./index.ts", "./dummy.ts"].includes(fileName)) return; // Exclude current file

  const moduleConfig = requireModule(fileName);

  const moduleName = _.camelCase(fileName.replace(/(\.\/|\.ts)/g, "")); // remove './' and '.ts'

  // console.log({ fileName });
  // console.log({ moduleConfig });

  modules[moduleName] = moduleConfig.default ?? moduleConfig;
});

export default modules;
