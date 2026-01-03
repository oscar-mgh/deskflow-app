
export interface RegisterRequest {
  fullName: string;
  email: string;
  company: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserClaims {
  id: string;
  sub: string;
  username: string;
  company: string;
  role: string;
}