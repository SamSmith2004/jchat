import { Session } from 'next-auth';

export interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    username: string;
  } & Session['user']
}