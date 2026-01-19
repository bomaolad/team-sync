import { Project, Task, TaskStatus, TaskPriority } from '@/src/types';

export interface IProjectStats {
  total: number;
  completed: number;
  progress: number;
}

export type FilterType = 'all' | 'active' | 'completed';
export type ViewMode = 'list' | 'board';

export const statusConfig: Record<string, { label: string; color: string }> = {
  TODO: { label: 'To Do', color: '#94A3B8' },
  IN_PROGRESS: { label: 'In Progress', color: '#F59E0B' },
  UNDER_REVIEW: { label: 'Under Review', color: '#8B5CF6' },
  DONE: { label: 'Done', color: '#10B981' },
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

export const getProjectStats = (
  projectId: string,
  allTasks: Task[],
): IProjectStats => {
  const projectTasks = allTasks.filter((t: Task) => t.projectId === projectId);
  const completedTasks = projectTasks.filter((t: Task) => t.status === 'DONE');
  const total = projectTasks.length;
  const completed = completedTasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, progress };
};
