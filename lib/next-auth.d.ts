import 'next-auth';

declare module 'next-auth' {
//Extends the built-in session types with additional properties.
  interface User {
    username?: string;
    bio?: string;
  }
  interface Session {
      user: User & {
        username?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        avatr?: string | null;
        id?: string | null;
        bio?: string;
        [key: string]: any; 
      };
      expires: string; 
      accessToken?: string; 
      refreshToken?: string; 
      [key: string]: any; 
    }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string;
    bio?: string;
  }
}