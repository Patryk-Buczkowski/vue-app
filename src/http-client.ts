import axios from 'axios';

const USER_ID = 3;
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const getTasks = () => {
  return httpClient.get(`/todos?userId=${USER_ID}`).then(res => {
    return res.data;
  });
};

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface CreateTodoPayload {
  title: string;
  completed: boolean;
  userId: number;
}

export const createTodo = (title: string): Promise<{ data: Todo }> => {
  return httpClient.post<CreateTodoPayload, { data: Todo }>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

interface DeleteTaskParams {
  taskId: number;
}

export const deleteTask = ({ taskId }: DeleteTaskParams): Promise<void> => {
  return httpClient.delete(`/todos/${taskId}`);
};

interface PatchTaskParams {
  taskId: number;
  title: string;
  completed: boolean;
}

export const patchTask = ({taskId, title, completed}: PatchTaskParams) => {
  return httpClient.patch(`/todos/${taskId}`, {
    title,
    completed,
  });
};
