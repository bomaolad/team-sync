import { api } from './api';
import { Attachment, CreateAttachmentRequest } from '../types';

export const attachmentService = {
  getByTask: (taskId: string): Promise<Attachment[]> =>
    api.get(`/tasks/${taskId}/attachments`).then(res => res.data),

  create: (
    taskId: string,
    data: CreateAttachmentRequest,
  ): Promise<Attachment> =>
    api.post(`/tasks/${taskId}/attachments`, data).then(res => res.data),

  delete: (taskId: string, attachmentId: string): Promise<void> =>
    api
      .delete(`/tasks/${taskId}/attachments/${attachmentId}`)
      .then(res => res.data),
};
