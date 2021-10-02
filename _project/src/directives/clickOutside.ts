import { Directive, DirectiveBinding } from "vue";

type ElExtended = HTMLElement & {
  __clickOutsideHandler__?: (evt: MouseEvent) => void;
};

const clickOutside: Directive<ElExtended> = {
  beforeMount(el, binding: DirectiveBinding<(...args: any[]) => void>, vnode) {
    function handler(evt: MouseEvent) {
      if (evt.target === el || el.contains(evt.target as HTMLElement)) return;
      binding.value(evt);
    }

    el.__clickOutsideHandler__ = handler;

    document.body.addEventListener("click", handler);
  },

  beforeUnmount(el, binding, vnode) {
    console.log("beforeUnmount", el.__clickOutsideHandler__!);
    document.body.removeEventListener("click", el.__clickOutsideHandler__!);
  },
};

export default clickOutside;
