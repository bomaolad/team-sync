import { api } from './api';
import {
  Team,
  TeamMember,
  CreateTeamRequest,
  UpdateTeamRequest,
  JoinTeamRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
} from '../types';

export const teamService = {
  getAll: (): Promise<Team[]> => api.get('/teams').then(res => res.data),

  getOne: (id: string): Promise<Team> =>
    api.get(`/teams/${id}`).then(res => res.data),

  create: (data: CreateTeamRequest): Promise<Team> =>
    api.post('/teams', data).then(res => res.data),

  update: (id: string, data: UpdateTeamRequest): Promise<Team> =>
    api.patch(`/teams/${id}`, data).then(res => res.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/teams/${id}`).then(res => res.data),

  join: (data: JoinTeamRequest): Promise<TeamMember> =>
    api.post('/teams/join', data).then(res => res.data),

  getMembers: (teamId: string): Promise<TeamMember[]> =>
    api.get(`/teams/${teamId}/members`).then(res => res.data),

  inviteMember: (
    teamId: string,
    data: InviteMemberRequest,
  ): Promise<TeamMember> =>
    api.post(`/teams/${teamId}/invite`, data).then(res => res.data),

  removeMember: (teamId: string, memberId: string): Promise<void> =>
    api.delete(`/teams/${teamId}/members/${memberId}`).then(res => res.data),

  updateMemberRole: (
    teamId: string,
    memberId: string,
    data: UpdateMemberRoleRequest,
  ): Promise<TeamMember> =>
    api
      .patch(`/teams/${teamId}/members/${memberId}/role`, data)
      .then(res => res.data),

  regenerateInviteCode: (teamId: string): Promise<Team> =>
    api.post(`/teams/${teamId}/regenerate-code`).then(res => res.data),
};
