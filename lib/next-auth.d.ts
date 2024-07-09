import 'next-auth';

declare module 'next-auth' {
//Extends the built-in session types with additional properties.
interface Session {
    user: {
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