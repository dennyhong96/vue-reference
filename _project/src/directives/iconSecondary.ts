import { Directive, DirectiveBinding } from "vue";

// Inserts a font awesome icon into element
const iconSecondaryDirective: Directive<HTMLElement> = {
  // created(el, binding, vnode) {},

  beforeMount(
    el,
    // Use object value instead of args and modifiers
    binding: DirectiveBinding<{ icon: string; right: boolean }>,
    vnode
  ) {
    const fontAwesomeIconName = binding.value.icon;

    let iconClass = `fa fa-${fontAwesomeIconName} text-xl text-green-500`;

    if (binding.value.right) {
      iconClass = `${iconClass} float-right`;
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },

  // mounted(el, binding, vnode) {},

  // beforeUpdate(el, binding, vnode, prevNode) {},

  // updated(el, binding, vnode, prevNode) {},

  // beforeUnmount(el, binding, vnode) {},

  // unmounted(el, binding, vnode) {},
};

export default iconSecondaryDirective;
