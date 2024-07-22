import 'next-auth';

declare module 'next-auth' {
//Extends the built-in session types with additional properties.
  interface User {
    username?: string;
    bio?: string;
    email?: string;
    phone?: string | null;
  }
  interface Session {
      user: User & {
        username?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        avatar?: string | null;
        id?: string | null;
        bio?: string;
        phone?: string | null;
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
    email?: string;
    username?: string;
    bio?: string;
    avatar?: string | null;
    phone?: string | null;
  }
}