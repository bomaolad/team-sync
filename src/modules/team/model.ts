import { Team, TeamMember, TeamRole } from '@/src/types';

export const getRoleBadgeVariant = (role: TeamRole) => {
  switch (role) {
    case 'OWNER':
    case 'ADMIN':
      return 'primary';
    case 'MEMBER':
      return 'info';
    case 'VIEWER':
      return 'default';
    default:
      return 'default';
  }
};
