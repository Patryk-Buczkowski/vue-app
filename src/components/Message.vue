<script>
let id;
export default {
  props: {
    active: Boolean,
  },
  data() {
    return {
      count: 0,
      message: '',
    };
  },
  methods: {
    show(message) {
      this.message = message;
    },

    hide() {
      this.message = '';
    },
  },
  mounted() {
    id = setInterval(() => {
      this.count++;
    }, 1000);
  },

  unmounted() {
    clearInterval(id);
  },
};
</script>

<template>
  <article class="message" :class="{ 'notification hidden': !active }">
    <div class="message-header">
      <slot name="header">Error</slot>
      <button class="delete" @click="hide"></button>
    </div>

    <div class="message-body">
      <slot :x="count">Message</slot>
    </div>
  </article>
</template>
