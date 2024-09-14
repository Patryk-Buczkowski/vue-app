<script>
export default {
    props: ['selected']
}
</script>

<template>
  <nav class="filter" data-cy="Filter">
    <a href="#/" class="filter__link" :class="{selected: selected === 'all'}" data-cy="FilterLinkAll"
      >All</a
    >
    <a href="#/Active" class="filter__link" :class="selected === 'active' && 'selected'" data-cy="FilterLinkActive"
      >Active</a
    >
    <a href="#/Completed" class="filter__link" :class="{selected: selected === 'completed'}" data-cy="FilterLinkCompleted"
      >Completed</a
    >
  </nav>
</template>

<style></style>
