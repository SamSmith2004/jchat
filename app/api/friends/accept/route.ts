import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, pool } from '@/backend/src/config/database';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const { requestId } = await req.json();
    console.log('Received requestId:', requestId);

    if (requestId === undefined) {
      throw new Error('requestId is undefined');
    }

    await connection.beginTransaction();

    // Update the status of the friend request to "accepted"
    await connection.execute(
      'UPDATE friend_requests SET status = "accepted" WHERE id = ?',
      [requestId]
    );

    // Retrieve the sender and receiver IDs for the accepted friend request
    const [requests] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT sender_id, receiver_id FROM friend_requests WHERE id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      throw new Error('Friend request not found');
    }

    const request = requests[0];
    if (request.sender_id === undefined || request.receiver_id === undefined) {
      throw new Error('sender_id or receiver_id is undefined');
    }

    // Insert records into the friends table to reflect the mutual friendship
    await connection.execute(
      'INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)',
      [request.sender_id, request.receiver_id, request.receiver_id, request.sender_id]
    );

    // Commit the transaction to finalize the changes in the database
    await connection.commit();

    return NextResponse.json({ message: 'Friend request accepted successfully' });

  } catch (error : any) {
    await connection.rollback(); // Rollback any changes if an error occurs during the transaction
    
    console.error('Error accepting friend request:', error);
    return NextResponse.json({ error: 'Failed to accept friend request', details: error.message }, { status: 500 });

  } finally {
    connection.release();
  }
}