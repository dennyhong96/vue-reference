import { Directive } from "vue";

// Inserts a font awesome icon into element
const iconDirective: Directive<HTMLElement> = {
  // created(el, binding, vnode) {},

  beforeMount(el, binding, vnode) {
    // v-icon="'headphones-alt'" - directive value
    const fontAwesomeIconName = binding.value;

    let iconClass = `fa fa-${fontAwesomeIconName} text-xl`;

    // v-icon:full="..." - directive arg
    // Can only apply one arg at a time
    if (binding.arg === "full") {
      iconClass = binding.value; // Overwrite icon class with directive value
    }

    // v-icon.right.yellow="..." - directive modifiers
    // Can apply multiple modifiers, value is boolean only
    if (binding.modifiers.right) {
      iconClass = `${iconClass} float-right`;
    }
    if (binding.modifiers.yellow) {
      iconClass = `${iconClass} text-yellow-400`;
    } else {
      iconClass = `${iconClass} text-green-400`;
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },

  // mounted(el, binding, vnode) {},

  // beforeUpdate(el, binding, vnode, prevNode) {},

  // updated(el, binding, vnode, prevNode) {},

  // beforeUnmount(el, binding, vnode) {},

  // unmounted(el, binding, vnode) {},
};

export default iconDirective;
