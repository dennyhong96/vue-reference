import { ref, Ref, watch, watchEffect } from "vue";

const usePhrases = (): {
  phrase: Ref<string>;
  reversePhrase: Ref<string>;
} => {
  const phrase = ref("");
  const reversePhrase = ref("");

  // Use watch to watch specific reactive variables as dependencies
  watch([phrase], ([newPhrase], [prevPhrase]) => {
    // console.log({ prevPhrase });
    // console.log({ newPhrase });
    reversePhrase.value = newPhrase
      .split("")
      .reverse()
      .join("");
  });

  // Use watchEffect to auto-detect dependencies
  // watchEffect(() => {
  //   reversePhrase.value = phrase.value
  //     .split("")
  //     .reverse()
  //     .join("");
  // });

  return {
    phrase,
    reversePhrase,
  };
};

export default usePhrases;
