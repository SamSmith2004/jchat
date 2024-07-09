import 'next-auth';

declare module 'next-auth' {
//Extends the built-in session types with additional properties.
interface User {
  username?: string;
}
interface Session {
    user: User & {
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
      [key: string]: any; 
    };
    expires: string; 
    accessToken?: string; 
    refreshToken?: string; 
    [key: string]: any; 
  }
}