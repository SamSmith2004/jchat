import { NextAuthOptions, User, getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google'; 

import bcrypt from 'bcrypt';
import { pool } from '@/backend/src/config/database';
import { RowDataPacket } from 'mysql2';

interface DbUser extends RowDataPacket {
    id: string;
    email: string;
    password: string;
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          const [rows] : any = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          );

          const user = await rows[0]; 

          if (!user) {
            console.log('User not found');
            return null;
          }

          if (!user.Password) {
            console.log('User has no password set');
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.Password);

          if (isValid) {
            console.log('Password is valid');
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword as User;

          } else {
            console.log('Invalid password');
            return null;
          }

        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    /**GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),**/
  ],
  pages: {
    signIn: '/', //signin page path
  },
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return redirect('/');
  }
}