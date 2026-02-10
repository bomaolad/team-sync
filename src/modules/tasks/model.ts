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
