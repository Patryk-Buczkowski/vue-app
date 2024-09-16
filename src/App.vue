<script>
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';
import { createTodo, deleteTask, getTasks } from './http-client';

export default {
  components: {
    StatusFilter,
    TodoItem,
  },
  mounted() {
    getTasks().then(data => {
      this.tasks = data;
    });
  },
  data() {
    const data = localStorage.getItem('tasks');
    // const tasks = data !== null ? JSON.parse(data) : [];
    return {
      tasks: [],
      title: '',
      activeFilteName: 'all',
      allTask: true,
    };
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
    clearCompleted() {
      this.tasks.forEach(task => {
        task.completed &&
          deleteTask(task.id).then(() => {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
          });
      });
    },
    toggleAll() {
      this.allTask = !this.allTask;

      return (this.tasks = this.tasks.map(task => ({
        ...task,
        completed: this.allTask,
      })));
    },
    handleSubmit() {
      const title = this.title;

      if (this.title.trim() === '') {
        return;
      }

      createTodo(this.title).then(({ data }) => {
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
</script>

<template>
  <div id="root">
    <div class="todoapp">
      <h1 class="todoapp__title">todos</h1>
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
              value=""
              v-model="title" />
          </form>
        </header>

        <section class="todoapp__main" data-cy="TodoList">
          <TransitionGroup name="list" tag="div">
            <TodoItem
              v-for="task of visibleTasks"
              :task="task"
              :key="task.id"
              @remove="removeTask" />
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
      <div
        data-cy="ErrorNotification"
        class="notification is-danger is-light has-text-weight-normal hidden">
        <button data-cy="HideErrorButton" type="button" class="delete"></button>
      </div>
    </div>
  </div>
</template>

<style>
.list-enter-active, /* remember to check where this class comes from */
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
