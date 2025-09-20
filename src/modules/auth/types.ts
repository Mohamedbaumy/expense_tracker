export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  session: string;
}
