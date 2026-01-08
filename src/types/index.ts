export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  jobTitle: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  user: User;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  teamId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  team?: Team;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  startDate: string | null;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  assignee?: User;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  taskId: string;
  uploadedById: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  teamId: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  startDate?: string;
  projectId: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  startDate?: string;
  assigneeId?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface CreateSubtaskRequest {
  title: string;
}

export interface UpdateSubtaskRequest {
  title?: string;
  completed?: boolean;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateAttachmentRequest {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface JoinTeamRequest {
  inviteCode: string;
}

export interface InviteMemberRequest {
  email: string;
  role?: TeamRole;
}

export interface UpdateMemberRoleRequest {
  role: TeamRole;
}

export interface ProjectQueryParams {
  teamId?: string;
}

export interface TaskQueryParams {
  projectId?: string;
  status?: TaskStatus;
  assigneeId?: string;
}

export interface ProjectProgress {
  total: number;
  completed: number;
  inProgress: number;
  underReview: number;
  todo: number;
  percentage: number;
}
