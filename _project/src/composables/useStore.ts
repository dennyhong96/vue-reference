import { useStore as _useStore } from "vuex";
import { AppStore, storeKey } from "@/store";

const useStore = (): AppStore => {
  return _useStore(storeKey);
};

export default useStore;
