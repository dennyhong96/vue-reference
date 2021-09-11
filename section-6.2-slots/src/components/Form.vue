<template>
  <form>
    <div class="help">
      <slot name="help"></slot>
    </div>

    <!-- Define default content in the slot -->
    <div class="fields">
      <slot name="fields">No fields to render.</slot>
    </div>

    <div class="buttons">
      <slot name="buttons"></slot>
    </div>

    <slot></slot>
  </form>
</template>
