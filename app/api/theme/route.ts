import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const [rows]: any[] = await pool.query('SELECT theme FROM user_themes WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      // If user doesn't exist, create a new one with default theme
      await pool.query('INSERT INTO user_themes (user_id, theme) VALUES (?, ?)', [userId, 'dark']);
      return NextResponse.json({ theme: 'dark' });
    }
    return NextResponse.json({ theme: rows[0].theme });
  } catch (error) {
    console.error('Failed to fetch theme:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { theme } = await req.json();

  if (!theme || (theme !== 'dark' && theme !== 'light')) {
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
  }

  try {
    // Check if user exists
    const [existingUser]: any[] = await pool.query('SELECT id FROM user_themes WHERE user_id = ?', [userId]);

    if (existingUser.length === 0) {
      await pool.query('INSERT INTO user_themes (user_id, theme) VALUES (?, ?)', [userId, theme]);
    } else {
      await pool.query('UPDATE user_themes SET theme = ? WHERE user_id = ?', [theme, userId]);
    }

    return NextResponse.json({ message: 'Theme updated successfully' });
  } catch (error) {
    console.error('Failed to update theme:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}