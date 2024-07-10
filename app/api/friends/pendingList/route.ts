import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

interface PendingFriendID {
    receiver_id: number; // or string if your ID is a UUID or similar
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId'); 
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const query = `
      SELECT receiver_id
      FROM friend_requests
      WHERE sender_id = ?;
    `;
    
    const pendingFriendsIDsResult: PendingFriendID[] = await executeQuery(query, [userId]); // Execute the query with the user ID

    if (!pendingFriendsIDsResult.length) { // If no pending friends found
      return NextResponse.json([]);
    }

    const pendingFriendsIDs = pendingFriendsIDsResult.map(row => row.receiver_id); // Extract the IDs from the result

    const placeholders = pendingFriendsIDs.map(() => '?').join(','); // Create a string of ? placeholders for the query
    const query2 = `
      SELECT Username
      FROM users
      WHERE UserID IN (${placeholders});
    `;

    const pendingFriends = await executeQuery(query2, pendingFriendsIDs);
    
    return NextResponse.json(pendingFriends);
  } 
  catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json({ error: 'Failed to fetch friends list' }, { status: 500 });
  }
}