export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  username: string;
  jobTitle: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: IUser;
}
