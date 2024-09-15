<script>
// import tasks from './todos';
// console.log({ tasks });
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';

export default {
  components: {
    StatusFilter,
    TodoItem,
  },
  data() {
    const data = localStorage.getItem('tasks');
    const tasks = data !== null ? JSON.parse(data) : [];
    return {
      tasks,
      title: '',
      activeFilteName: 'completed',
    };
  },
  mounted() {
    console.log(this.tasks);
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
      return this.tasks = this.tasks.filter(task => !task.completed)
    },
    handleSubmit() {
      const title = this.title;

      if (this.title.trim() === '') {
        return;
      }
      this.tasks.push({
        id: Date.now(),
        title: this.title,
        completed: false,
      });

      this.title = '';
    },

    removeTask({ id }) {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index === -1) {
        return;
      }
      this.tasks.splice(index, 1);
    },
  },

  watch: {
    title() {
      console.log(this.title);
    },

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
          <TodoItem
            v-for="task of visibleTasks"
            :task="task"
            @remove="removeTask" />
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
