import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
  TaskQueryParams,
} from '../types';

export const useTasks = (params?: TaskQueryParams) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.getAll(params),
  });
};

export const useMyTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'my-tasks'],
    queryFn: () => taskService.getMyTasks(),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskService.getOne(id),
    enabled: !!id,
  });
};

export const useProjectProgress = (projectId: string) => {
  return useQuery({
    queryKey: ['projects', projectId, 'progress'],
    queryFn: () => taskService.getProjectProgress(projectId),
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.create(data),
    onSuccess: task => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({
        queryKey: ['projects', task.projectId, 'progress'],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      taskService.update(id, data),
    onSuccess: task => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskStatusRequest }) =>
      taskService.updateStatus(id, data),
    onSuccess: task => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
      queryClient.invalidateQueries({
        queryKey: ['projects', task.projectId, 'progress'],
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useSubtasks = (taskId: string) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'subtasks'],
    queryFn: () => taskService.getSubtasks(taskId),
    enabled: !!taskId,
  });
};

export const useCreateSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: CreateSubtaskRequest;
    }) => taskService.createSubtask(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskId, 'subtasks'],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};

export const useUpdateSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subtaskId,
      taskId,
      data,
    }: {
      subtaskId: string;
      taskId: string;
      data: UpdateSubtaskRequest;
    }) => taskService.updateSubtask(subtaskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskId, 'subtasks'],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subtaskId,
      taskId,
    }: {
      subtaskId: string;
      taskId: string;
    }) => taskService.deleteSubtask(subtaskId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskId, 'subtasks'],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};
