export interface AuthResult<TUser = unknown> {
  token: string;
  user: TUser;
}

export interface AuthProvider<TLoginInput = unknown, TUser = unknown> {
  login(data: TLoginInput): Promise<AuthResult<TUser>>;
}