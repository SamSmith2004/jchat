import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const { senderId, receiverId } = body;
    console.log('Extracted senderId:', senderId, 'receiverId:', receiverId);
    
    // Validate input
    if (senderId === undefined || receiverId === undefined) {
      return NextResponse.json({ error: 'senderId and receiverId are required' }, { status: 400 });
    }

    const senderIdNum = Number(senderId);
    const receiverIdNum = Number(receiverId);

    if (isNaN(senderIdNum) || isNaN(receiverIdNum)) {
      return NextResponse.json({ error: 'Invalid senderId or receiverId' }, { status: 400 });
    }

    // Check if sender is trying to add themselves
    if (senderIdNum === receiverIdNum) {
      return NextResponse.json({ error: 'You cannot add yourself as a friend' }, { status: 400 });
    }

    // Check if the friend request already exists
    const checkQuery = `
      SELECT id FROM friend_requests 
      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
    `;
    const existingRequests = await executeQuery(checkQuery, [senderIdNum, receiverIdNum]);
    
    if (Array.isArray(existingRequests) && existingRequests.length > 0) {
      return NextResponse.json({ error: 'Friend request already sent' }, { status: 400 });
    }

    // Insert the new friend request
    const insertQuery = `
      INSERT INTO friend_requests (sender_id, receiver_id)
      VALUES (?, ?)
    `;
    
    await executeQuery(insertQuery, [senderIdNum, receiverIdNum]);
    
    return NextResponse.json({ message: 'Friend request sent successfully' });
  } 
  catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}