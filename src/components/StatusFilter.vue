<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
};
</script>

<template>
  <nav class="filter" data-cy="Filter">
    <a
      href="#/"
      class="filter__link"
      :class="{ selected: modelValue === 'all' }"
      @click="$emit('update:modelValue', 'all')"
      data-cy="FilterLinkAll"
      >All</a
    >
    <a
      href="#/Active"
      class="filter__link"
      :class="{selected: modelValue === 'active'}"
      @click="$emit('update:modelValue', 'active')"
      data-cy="FilterLinkActive"
      >Active</a
    >
    <a
      href="#/Completed"
      class="filter__link"
      :class="{ selected: modelValue === 'completed' }"
      @click="$emit('update:modelValue', 'completed')"
      data-cy="FilterLinkCompleted"
      >Completed</a
    >
  </nav>
</template>

<style></style>
