import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';
import Redis from 'ioredis';

const redis = new Redis({
  host: '100.106.217.25',
  port: 30036
});

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
   
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const query = `
      SELECT u.UserID, u.Username, u.avatar
      FROM friends AS f
      JOIN users AS u ON f.friend_id = u.UserID
      WHERE f.user_id = ?
    `;
   
    const friends: any[] = await executeQuery(query, [userId]);

    // Check online status for each friend
    const friendsWithStatus = await Promise.all(friends.map(async (friend: any) => {
      const isOnline = await redis.exists(`user:${friend.UserID}:status`);
      return {
        id: friend.UserID,
        name: friend.Username,
        avatar: friend.avatar, 
        status: isOnline ? 'online' : 'offline'
      };
    }));
   
    return NextResponse.json(friendsWithStatus);
  }
  catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json({ error: 'Failed to fetch friends list' }, { status: 500 });
  }
}