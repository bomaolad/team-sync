import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services';
import { CreateCommentRequest } from '../types';

export const useComments = (taskId: string) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => commentService.getByTask(taskId),
    enabled: !!taskId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: CreateCommentRequest;
    }) => commentService.create(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskId, 'comments'],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      commentId,
    }: {
      taskId: string;
      commentId: string;
    }) => commentService.delete(taskId, commentId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskId, 'comments'],
      });
    },
  });
};
