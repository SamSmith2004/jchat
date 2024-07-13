import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

interface PendingFriend {
    id: number;
    Username: string;
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
   
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const query = `
      SELECT fr.id, u.Username
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.UserID
      WHERE fr.receiver_id = ? AND fr.status = 'pending';
    `;
   
    const pendingFriends: PendingFriend[] = await executeQuery(query, [userId]);

    console.log('Pending friends from database:', JSON.stringify(pendingFriends, null, 2));

    return NextResponse.json(pendingFriends);
  }
  catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json({ error: 'Failed to fetch friends list' }, { status: 500 });
  }
}