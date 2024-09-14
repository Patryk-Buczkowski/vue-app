<script>
import tasks from './todos';
console.log({ tasks });

export default {
  data() {
    return {
      tasks,
      title: '',
    };
  },
  mounted() {
    console.log(this.tasks);
  },
  computed: {
    remainingTasks() {
      return this.tasks.filter(task => task.completed);
    },
  },
  methods: {
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
          <div
            v-for="(task, index) of tasks"
            data-cy="Todo"
            class="todo"
            :class="{ completed: task.completed }">
            <label class="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                class="todo__status"
                v-model="task.completed" />
            </label>
            <span data-cy="TodoTitle" class="todo__title">{{
              task.title
            }}</span>

            <button
              @click="tasks.splice(index, 1)"
              type="button"
              class="todo__remove"
              data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" class="modal overlay">
              <div class="modal-background has-background-white-ter"></div>
              <div class="loader"></div>
            </div>
          </div>
        </section>

        <footer class="todoapp__footer" data-cy="Footer">
          <span class="todo-count" data-cy="TodosCounter"
            >{{ remainingTasks.length }} items left</span
          >
          <nav class="filter" data-cy="Filter">
            <a href="#/" class="filter__link selected" data-cy="FilterLinkAll"
              >All</a
            >
            <a href="#/Active" class="filter__link" data-cy="FilterLinkActive"
              >Active</a
            >
            <a
              href="#/Completed"
              class="filter__link"
              data-cy="FilterLinkCompleted"
              >Completed</a
            >
          </nav>

          <button
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
