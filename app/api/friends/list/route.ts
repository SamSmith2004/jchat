import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
   
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const query = `
      SELECT u.UserID, u.Username, u.avatar, u.bio, u.banner
      FROM friends AS f
      JOIN users AS u ON f.friend_id = u.UserID
      WHERE f.user_id = ?
    `;
   
    const friends: any[] = await executeQuery(query, [userId]);
   
    return NextResponse.json(friends);
  }
  catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json({ error: 'Failed to fetch friends list' }, { status: 500 });
  }
}