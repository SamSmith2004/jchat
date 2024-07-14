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

    // Update the status of the friend request to "rejected"
    const [updateResult] = await connection.execute(
      'UPDATE friend_requests SET status = "rejected" WHERE id = ?',
      [requestId]
    );

    if ((updateResult as mysql.ResultSetHeader).affectedRows === 0) {
      throw new Error('Friend request not found');
    }

    // Commit the transaction to finalize the changes in the database
    await connection.commit();

    return NextResponse.json({ message: 'Friend request rejected successfully' });
  } catch (error: any) {
    await connection.rollback(); // Rollback any changes if an error occurs during the transaction
    
    console.error('Error rejecting friend request:', error);
    return NextResponse.json({ error: 'Failed to reject friend request', details: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}