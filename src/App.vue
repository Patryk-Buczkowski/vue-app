<!-- <script>
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';
import { createTodo, deleteTask, getTasks, patchTask } from './http-client';
import Message from './components/Message.vue';

export default {
  components: {
    StatusFilter,
    TodoItem,
    Message,
  },

  data() {
    const data = localStorage.getItem('tasks');
    const tasks = data !== null ? JSON.parse(data) : [];
    return {
      list: [],
      tasks: [],
      title: '',
      activeFilteName: 'all',
      allTask: true,
    };
  },

  mounted() {
    getTasks()
      .then(data => {
        this.tasks = data;
        // return Promise.reject();
      })
      .catch(() => {
        this.$refs.errorMessage.show('Unable to load todos');
      });
  },

  computed: {
    remainingTasks() {
      return this.tasks.filter(task => !task.completed);
    },
    completedTasks() {
      return this.tasks.filter(task => task.completed);
    },
    visibleTasks() {
      switch (this.activeFilteName) {
        case 'active':
          return this.remainingTasks;
        case 'completed':
          return this.completedTasks;
        case 'all':
        default:
          return this.tasks;
      }
    },
  },
  methods: {
    updateTask(updatedTask) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);

      if (index !== -1) {
        this.tasks.splice(index, 1, updatedTask);
      }
    },

    clearCompleted() {
      this.tasks.forEach(task => {
        task.completed &&
          deleteTask(task.id).then(() => {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
          });
      });
    },

    async toggleAll() {
      const allCompleted = this.tasks.every(task => task.completed);
      const newStatus = !allCompleted;

      const promises = this.tasks.map(task =>
        patchTask({
          taskId: task.id,
          title: task.title,
          completed: newStatus,
        }),
      );

      try {
        await Promise.all(promises);
        console.log('po promidse all')

         this.tasks.forEach(task => {
          task.completed = newStatus;
        });
        
        console.log('ostatnia linia')
      } catch (error) {
        this.$refs.errorMessage.show('Unable to update all tasks.');
      }
    },
    handleSubmit() {
      const title = this.title;

      if (title.trim() === '') {
        return;
      }

      createTodo(title.trim()).then(({ data }) => {
        this.tasks = [...this.tasks, data];
        this.title = '';
      });
    },

    removeTask({ id }) {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index === -1) {
        return;
      }

      deleteTask(id).then(this.tasks.splice(index, 1));
    },
  },

  watch: {
    /* remember to analize this */
    tasks: {
      deep: true,
      handler() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
      },
    },
  },
};
</script> -->

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';
import Message from './components/Message.vue';
import { createTodo, deleteTask, getTasks, patchTask } from './http-client';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const list = ref<string[]>([]);
const tasks = ref<Task[]>([]);
const title = ref<string>('');
const activeFilteName = ref<string>('all');
const errorMessage = ref<InstanceType<typeof Message> | null>(null);

onMounted(() => {
  getTasks()
    .then(data => {
      tasks.value = data;
    })
    .catch(() => {
      if (errorMessage.value) {
        errorMessage.value.show('Unable to load todos');
      }
    });
});

const remainingTasks = computed(() =>
  tasks.value.filter(task => !task.completed),
);
const completedTasks = computed(() =>
  tasks.value.filter(task => task.completed),
);
const visibleTasks = computed(() => {
  switch (activeFilteName.value) {
    case 'active':
      return remainingTasks.value;
    case 'completed':
      return completedTasks.value;
    default:
      return tasks.value.sort((a, b) => +a.completed - +b.completed);
  }
});

const updateTask = (updatedTask: Task) => {
  const index = tasks.value.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks.value.splice(index, 1, updatedTask);
  }
};

const clearCompleted = () => {
  tasks.value.forEach(task => {
    if (task.completed) {
      deleteTask({ taskId: task.id }).then(() => {
        tasks.value = tasks.value.filter(t => t.id !== task.id);
      });
    }
  });
};

const toggleAll = async () => {
  const allCompleted = tasks.value.every(task => task.completed);
  const newStatus = !allCompleted;
  const promises = tasks.value.map(task =>
    patchTask({
      taskId: task.id,
      title: task.title,
      completed: newStatus,
    }),
  );

  try {
    await Promise.all(promises);
    tasks.value.forEach(task => {
      task.completed = newStatus;
    });
  } catch (error) {
    if (errorMessage.value) {
      errorMessage.value.show('Unable to update all tasks.');
    }
  }
};

const handleSubmit = () => {
  if (title.value.trim() === '') {
    return;
  }
  createTodo(title.value.trim()).then(({ data }) => {
    tasks.value = [...tasks.value, data];
    title.value = '';
  });
};

const removeTask = ({ id }: { id: number }) => {
  const index = tasks.value.findIndex(task => task.id === id);
  if (index === -1) {
    return;
  }
  deleteTask({ taskId: id }).then(() => {
    tasks.value.splice(index, 1);
  });
};

watch(tasks, newTasks => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  },
  { deep: true },
);
</script>
<template>
  <div id="root">
    <div class="todoapp">
      <h1 class="todoapp__title">todos</h1>
      <label>
        <input type="checkbox" value="pierwszy" v-model="list" />
        Pierwszy
      </label>

      <label>
        <input type="checkbox" value="drugi" v-model="list" />
        Drugi
      </label>

      <label>
        <input type="checkbox" value="trzeci" v-model="list" />
        Trzeci
      </label>
      <br />
      {{ list }}

      <div class="todoapp__content">
        <header class="todoapp__header">
          <button
            @click="toggleAll"
            type="button"
            class="todoapp__toggle-all"
            data-cy="ToggleAllButton"></button>

          <form @submit.prevent="handleSubmit">
            <input
              data-cy="NewTodoField"
              type="text"
              class="todoapp__new-todo"
              placeholder="What needs to be done?"
              v-model="title" />
          </form>
        </header>

        <section class="todoapp__main" data-cy="TodoList">
          <TransitionGroup name="list" tag="div">
            <TodoItem
              v-for="task of visibleTasks"
              :task="task"
              :key="`${task.id}${task.completed}`"
              @remove="removeTask"
              @update="updateTask" />
          </TransitionGroup>
        </section>

        <footer class="todoapp__footer" data-cy="Footer">
          <span class="todo-count" data-cy="TodosCounter"
            >{{ remainingTasks.length }} items left</span
          >

          <StatusFilter v-model="activeFilteName" />

          <button
            @click="clearCompleted"
            type="button"
            class="todoapp__clear-completed"
            data-cy="ClearCompletedButton">
            Clear completed
          </button>
        </footer>
      </div>

      <Message ref="errorMessage" class="is-warning">
        <template #default="{ x, message }">
          <p>{{ message }} {{ x }} seconds ago</p>
        </template>

        <template #header>
          <p>Server error</p>
        </template>
      </Message>
    </div>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
  max-height: 60px;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
