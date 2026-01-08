import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamService } from '../services';
import {
  CreateTeamRequest,
  UpdateTeamRequest,
  JoinTeamRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
} from '../types';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getAll(),
  });
};

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamService.getOne(id),
    enabled: !!id,
  });
};

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ['teams', teamId, 'members'],
    queryFn: () => teamService.getMembers(teamId),
    enabled: !!teamId,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamRequest }) =>
      teamService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', id] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinTeamRequest) => teamService.join(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string;
      data: InviteMemberRequest;
    }) => teamService.inviteMember(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'members'] });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, memberId }: { teamId: string; memberId: string }) =>
      teamService.removeMember(teamId, memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'members'] });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      memberId,
      data,
    }: {
      teamId: string;
      memberId: string;
      data: UpdateMemberRoleRequest;
    }) => teamService.updateMemberRole(teamId, memberId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'members'] });
    },
  });
};

export const useRegenerateInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => teamService.regenerateInviteCode(teamId),
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] });
    },
  });
};
