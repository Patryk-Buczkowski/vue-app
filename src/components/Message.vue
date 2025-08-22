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
  watch: {
    count: {
      handler() {
        // console.log('count', this.count);
      },
    },
  },

  mounted() {
    id = setInterval(() => {
      this.count++;
    }, 1000);
  },

  unmounted() {
    clearInterval(id);
    console.log('id3', id);
  },
  methods: {
    show(message) {
      this.message = message;
      console.log('id1', id);
    },

    hide() {
      this.message = '';
      clearInterval(id);
      console.log('id2', id);
    },
  },
};
</script>

<template>
  <article class="message" :class="{ 'notification hidden': message === '' }">
    <div class="message-header">
      <slot name="header">Error</slot>
      <button class="delete" @click="hide"></button>
    </div>

    <div class="message-body">
      <slot :x="count" :message="message">Message </slot>
    </div>
  </article>
</template>
