import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId } = await req.json();
    
    const query = `
      INSERT INTO friend_requests (sender_id, receiver_id)
      VALUES (?, ?)
    `;
    
    await executeQuery(query, [senderId, receiverId]);
    
    return NextResponse.json({ message: 'Friend request sent successfully' });
  } 
  catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}