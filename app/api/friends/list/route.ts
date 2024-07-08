import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId'); // 
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const query = `
      SELECT u.id, u.username
      FROM friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = ?
    `;
    
    const friends = await executeQuery(query, [userId]); // Execute the query with the user ID
    
    return NextResponse.json(friends);
  } 
  catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json({ error: 'Failed to fetch friends list' }, { status: 500 });
  }
}