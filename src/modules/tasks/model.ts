import { Task, TaskStatus, TaskPriority, Comment, Subtask } from '@/src/types';
import { ApTheme } from '@/src/components';

export const statusConfig: Record<
  TaskStatus,
  { label: string; color: string }
> = {
  TODO: { label: 'To Do', color: ApTheme.Color.status.todo },
  IN_PROGRESS: { label: 'In Progress', color: ApTheme.Color.status.inProgress },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: ApTheme.Color.status.underReview,
  },
  DONE: { label: 'Done', color: ApTheme.Color.status.done },
};

export const statusOrder: TaskStatus[] = [
  'TODO',
  'IN_PROGRESS',
  'UNDER_REVIEW',
  'DONE',
];

export const mapPriority = (
  priority: TaskPriority,
): 'low' | 'medium' | 'high' => {
  const priorityMap: Record<TaskPriority, 'low' | 'medium' | 'high'> = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  };
  return priorityMap[priority] || 'medium';
};

export const formatDate = (date: string | null): string => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTimestamp = (date: string): string => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffMs = now.getTime() - commentDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};
