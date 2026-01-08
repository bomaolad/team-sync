import { api } from './api';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectQueryParams,
} from '../types';

export const projectService = {
  getAll: (params?: ProjectQueryParams): Promise<Project[]> =>
    api.get('/projects', { params }).then(res => res.data),

  getOne: (id: string): Promise<Project> =>
    api.get(`/projects/${id}`).then(res => res.data),

  create: (data: CreateProjectRequest): Promise<Project> =>
    api.post('/projects', data).then(res => res.data),

  update: (id: string, data: UpdateProjectRequest): Promise<Project> =>
    api.patch(`/projects/${id}`, data).then(res => res.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/projects/${id}`).then(res => res.data),
};
