import { api } from './api';
import { Comment, CreateCommentRequest } from '../types';

export const commentService = {
  getByTask: (taskId: string): Promise<Comment[]> =>
    api.get(`/tasks/${taskId}/comments`).then(res => res.data),

  create: (taskId: string, data: CreateCommentRequest): Promise<Comment> =>
    api.post(`/tasks/${taskId}/comments`, data).then(res => res.data),

  delete: (taskId: string, commentId: string): Promise<void> =>
    api.delete(`/tasks/${taskId}/comments/${commentId}`).then(res => res.data),
};
