import { computed, ref, Ref, ComputedRef } from "vue";

const useNumber = (): {
  num: Ref<number>;
  double: ComputedRef<number>;
  increment: () => void;
} => {
  // ref value can be primitive or object
  const num = ref(5);
  // computed is similar to watchEffect, but instead must return a value in the callback
  // the returned value is then turned in to a reactive reference
  const double = computed(() => num.value * 2);
  const increment = () => {
    // access value of ref with ref.value
    num.value++;
  };

  return {
    num,
    double,
    increment,
  };
};

export default useNumber;
