import { Session } from 'next-auth';

export interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    username: string;
    image?: string | null;
    avatar?: string | null;
    bio?: string | null;
  } & Session['user']
}