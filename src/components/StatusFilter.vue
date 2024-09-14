<script>
export default {
  props: ['selected'],
  emits: ['change']
};
</script>

<template>
  <nav class="filter" data-cy="Filter">
    <a
      href="#/"
      class="filter__link"
      :class="{ selected: selected === 'all' }"
      @click="$emit('change', 'all')"
      data-cy="FilterLinkAll"
      >All</a
    >
    <a
      href="#/Active"
      class="filter__link"
      :class="selected === 'active' && 'selected'"
      @click="$emit('change', 'active')"
      data-cy="FilterLinkActive"
      >Active</a
    >
    <a
      href="#/Completed"
      class="filter__link"
      :class="{ selected: selected === 'completed' }"
      @click="$emit('change', 'completed')"
      data-cy="FilterLinkCompleted"
      >Completed</a
    >
  </nav>
</template>

<style></style>
