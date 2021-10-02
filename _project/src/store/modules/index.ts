import { ModuleTree } from "vuex";
import _ from "lodash";

import { State } from "..";

// Automatically register vuex modules
const storeMoudles = require.context(".", true, /\.ts$/i);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modules: ModuleTree<State> = {};

storeMoudles.keys().forEach((fileName) => {
  if (["./index.ts", "./dummy.ts"].includes(fileName)) return; // Exclude irrelevant modules

  const moduleConfig = storeMoudles(fileName); // import the moudle

  const moduleName = _.camelCase(fileName.replace(/(\.\/|\.ts)/g, "")); // remove './' and '.ts'

  // console.log({ fileName });
  // console.log({ moduleConfig });

  modules[moduleName] = moduleConfig.default ?? moduleConfig;
});

export default modules;
