import { Task, Project, TaskStatus, TaskPriority } from '@/src/types';

export interface IDashboardData {
  tasks: Task[];
  projects: Project[];
  activeTasks: Task[];
  completedTasks: Task[];
}

export interface IDashboardStats {
  projectCount: number;
  activeTaskCount: number;
  completedTaskCount: number;
  totalTaskCount: number;
}

export const mapStatus = (
  status: TaskStatus,
): 'todo' | 'inProgress' | 'underReview' | 'done' => {
  const statusMap: Record<
    TaskStatus,
    'todo' | 'inProgress' | 'underReview' | 'done'
  > = {
    TODO: 'todo',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    DONE: 'done',
  };
  return statusMap[status] || 'todo';
};

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

export const formatDueDate = (dueDate: string | null): string => {
  if (!dueDate) return 'No due date';
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
