<template>
  <a
    v-if="isExternalLink"
    v-bind="$attrs"
    :href="$props.to"
    target="_blank"
    rel="noreferrer noopener"
  >
    <slot></slot>
  </a>

  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <!-- :to="undefined" removes the to="[object object]" from element -->
    <a
      v-bind="$attrs"
      :class="isActive ? $props.activeClass : $props.inactiveClass"
      :href="href"
      @click="navigate"
      :to="undefined"
    >
      <slot></slot>
    </a>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "AppLink",

  inheritAttrs: false,

  setup(props, context) {
    // console.log(JSON.stringify(context.attrs, null, 2));
    const isExternalLink = computed(() => {
      return typeof props.to === "string" && props.to.startsWith("http");
    });
    return { isExternalLink };
  },

  props: {
    // @ts-ignore
    ...RouterLink.props,
    inactiveClass: {
      type: String as PropType<string>,
      default: "",
    },
  },
});
</script>

<style scoped></style>
