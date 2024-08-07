import { Session } from 'next-auth';

export interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    phone?: number | string | null;
    banner?: string | null;
  } & Session['user']
}