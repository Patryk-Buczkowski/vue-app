import axios from 'axios';

const USER_ID = 2;
const httpClient = axios.create({
  baseURL: 'https://mate.academy/students-api/',
});

export const getTasks = () => {
  return httpClient.get(`/todos?userId=${USER_ID}`).then(res => {
    return res.data;
  });
};

export const createTodo = (title) => {
  return httpClient.post('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTask = (taskId) => {
  return httpClient.delete(`/todos/${taskId}`)
};
