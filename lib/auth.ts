import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google'; 

import { NextAuthOptions, User as NextAuthUser, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { pool } from '@/backend/src/config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { JWT } from 'next-auth/jwt';

interface CustomUser extends NextAuthUser {
  username?: string;
  bio?: string;
  avatar?: string;
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
            const { Password, ...userWithoutPassword } = user;
            //console.log('User:', userWithoutPassword, 'id', userWithoutPassword.UserID, 'email', userWithoutPassword.Email, 'username', userWithoutPassword.Username);
            return {
              id: userWithoutPassword.UserID,
              email: userWithoutPassword.Email,
              username: userWithoutPassword.Username,
            } as NextAuthUser;

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
      },
      profile(profile): CustomUser {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
          username: profile.email.split('@')[0], // Use email prefix as username
          bio: '', 
        }
      }
    }),
    /**GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),**/
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const customUser = user as CustomUser;
        try {
          // Check if user exists
          const [existingUsers] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ?',
            [customUser.email]
          );
  
          if (existingUsers.length === 0) {
            // User doesn't exist, create a new one
            const [result] = await pool.query<ResultSetHeader>(
              'INSERT INTO users (email, username) VALUES (?, ?)',
              [customUser.email, customUser.username]
            );
            customUser.id = result.insertId.toString();
          } else {
            // User exists, update their information
            await pool.query(
              'UPDATE users SET username = ? WHERE email = ?',
              [customUser.username, customUser.email]
            );
            customUser.id = existingUsers[0].UserID.toString();
          }
          return true;
        } catch (error) {
          console.error('Error saving Google user:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
          session.user.id = token.id as string;
          session.user.username = token.username as string;
          session.user.bio = token.bio as string | undefined;
          session.user.avatar = token.avatar as string | null | undefined;
          session.user.email = token.email as string | undefined;
          session.user.phone = token.phone as string | null | undefined;
      }
      return session;
  },
  async jwt({ token, user, trigger, session }) {
    if (trigger === "update" && session?.user) {
        // Update token with new session data
        token.username = session.user.username;
        token.bio = session.user.bio;
        token.avatar = session.user.avatar;
        token.email = session.user.email;
        token.phone = session.user.phone;
    }
    if (user) {
        token.id = user.id;
        token.username = (user as CustomUser).username;
        token.bio = (user as CustomUser).bio;
        token.avatar = (user as CustomUser).avatar || user.image;
        token.email = user.email;
        token.phone = (user as CustomUser).phone;
    }
    return token;
},
  },
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