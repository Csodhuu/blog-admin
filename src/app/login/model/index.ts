export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  refresh_token?: string;
  [key: string]: unknown;
}
