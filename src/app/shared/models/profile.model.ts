export interface IProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  password: string;
  age: number;
  updatedTime: Date;
}
