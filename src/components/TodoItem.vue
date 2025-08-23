<!-- <script setup lang="ts">
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
      }).then(() => {
        this.$emit('update', {
          ...this.task,
          completed: newValue,
        });
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
console.log('url', import.meta.env.VITE_BASE_URL);
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
<style></style> -->

<script setup lang="ts">
import { ref, watch, nextTick, PropType } from 'vue';
import { patchTask } from '@/http-client';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
});

const emit = defineEmits({
  remove: (payload: { id: number }) => {
    if (payload && typeof payload.id === 'number') {
      return true;
    } else {
      console.warn('missing task id');
      return false;
    }
  },
  update: (payload: { id: number; title: string; completed: boolean }) => {
    return true;
  },
});

const editing = ref(false);
const newTitle = ref('');
const isCompleted = ref(props.task.completed);
const edited = ref<HTMLInputElement | null>(null);

watch(isCompleted, (newValue) => {
  patchTask({
    taskId: props.task.id,
    title: props.task.title,
    completed: newValue,
  }).then(() => {
    emit('update', {
      ...props.task,
      completed: newValue,
    });
  });
});

const edit = () => {
  editing.value = true;
  newTitle.value = props.task.title;
  nextTick(() => {
    edited.value?.focus();
  });
};

const cancel = () => {
  editing.value = false;
};

const rename = () => {
  if (!editing.value) {
    return;
  }

  patchTask({
    taskId: props.task.id,
    title: newTitle.value,
    completed: props.task.completed,
  }).then(() => {
    
    emit('update', {
      id: props.task.id,
      title: newTitle.value,
      completed: props.task.completed,
    });
    editing.value = false;
  });
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
        @blur="rename()"
        type="text"
        placeholder="empty task will be deleted"
        v-model="newTitle"
        class="todo__title-field" />
    </form>

    <template v-else>
      <span @dblclick="edit" data-cy="TodoTitle" class="todo__title">{{
        task.title
      }}</span>

      <button
        @click="emit('remove', { id: task.id })"
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