import { api } from './api';
import {
  Task,
  Subtask,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
  TaskQueryParams,
  ProjectProgress,
} from '../types';

export const taskService = {
  getAll: (params?: TaskQueryParams): Promise<Task[]> =>
    api.get('/tasks', { params }).then(res => res.data),

  getMyTasks: (): Promise<Task[]> =>
    api.get('/tasks/my-tasks').then(res => res.data),

  getOne: (id: string): Promise<Task> =>
    api.get(`/tasks/${id}`).then(res => res.data),

  create: (data: CreateTaskRequest): Promise<Task> =>
    api.post('/tasks', data).then(res => res.data),

  update: (id: string, data: UpdateTaskRequest): Promise<Task> =>
    api.patch(`/tasks/${id}`, data).then(res => res.data),

  updateStatus: (id: string, data: UpdateTaskStatusRequest): Promise<Task> =>
    api.patch(`/tasks/${id}/status`, data).then(res => res.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/tasks/${id}`).then(res => res.data),

  getSubtasks: (taskId: string): Promise<Subtask[]> =>
    api.get(`/tasks/${taskId}/subtasks`).then(res => res.data),

  createSubtask: (
    taskId: string,
    data: CreateSubtaskRequest,
  ): Promise<Subtask> =>
    api.post(`/tasks/${taskId}/subtasks`, data).then(res => res.data),

  updateSubtask: (
    subtaskId: string,
    data: UpdateSubtaskRequest,
  ): Promise<Subtask> =>
    api.patch(`/tasks/subtasks/${subtaskId}`, data).then(res => res.data),

  deleteSubtask: (subtaskId: string): Promise<void> =>
    api.delete(`/tasks/subtasks/${subtaskId}`).then(res => res.data),

  getProjectProgress: (projectId: string): Promise<ProjectProgress> =>
    api.get(`/tasks/project/${projectId}/progress`).then(res => res.data),
};
