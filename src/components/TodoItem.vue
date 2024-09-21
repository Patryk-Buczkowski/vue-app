<script>
import { patchTask } from '@/http-client';

export default {
  name: 'TodoItem',
  props: {
    task: Object,
  },
  data() {
    return {
      editing: false,
      newTitle: '',
      isCompleted: this.task.completed,
    };
  },
  watch: {
    isCompleted(newValue) {
      patchTask({
        taskId: this.task.id,
        title: this.task.title,
        completed: newValue,
      });
    },
  },
  emits: {
    remove: payload => {
      if (payload) {
        return true;
      } else {
        console.warn('missing task id');
        return false;
      }
    },
  },

  methods: {
    edit() {
      this.editing = true;
      this.newTitle = this.task.title;

      this.$nextTick(() => {
        this.$refs.edited.focus();
      });
    },
    cancel() {
      this.editing = false;
    },

    rename() {
      patchTask({
        taskId: this.task.id,
        title: this.newTitle,
        completed: this.task.completed,
      }).then(() => {
        if (this.editing === false) {
          return;
        }
        this.task.title = this.newTitle;
        this.editing = false;
      });
    },
  },
};
</script>

<template>
  <div data-cy="Todo" class="todo" :class="{ completed: isCompleted }">
    <label class="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        class="todo__status"
        v-model="isCompleted" />
    </label>

    <form v-if="editing" @submit.prevent="rename">
      <input
        ref="edited"
        @keyup.esc="cancel"
        @blur="rename(task.id)"
        type="text"
        placeholder="empty task will be deleted"
        value="task is edited"
        v-model="newTitle"
        class="todo__title-field" />
    </form>

    <template v-else>
      <span @dblclick="edit" data-cy="TodoTitle" class="todo__title">{{
        task.title
      }}</span>

      <button
        @click="$emit('remove', { id: task.id })"
        type="button"
        class="todo__remove"
        data-cy="TodoDelete">
        ×
      </button>
    </template>

    <div data-cy="TodoLoader" class="modal overlay">
      <div class="modal-background has-background-white-ter"></div>
      <div class="loader"></div>
    </div>
  </div>
</template>
<style></style>
