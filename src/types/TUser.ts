export interface TUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'User' | 'Administrator';
}
