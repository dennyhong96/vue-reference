import { DummyState } from "..";

// For testing dynamic module registering
export const state: () => DummyState = () => ({
  foo: "bar",
});

export default {
  state,
};
