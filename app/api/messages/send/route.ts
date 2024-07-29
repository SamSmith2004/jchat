import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';
import { RowDataPacket } from 'mysql2';

interface UserCountResult extends RowDataPacket {
    count: number;
}

export async function POST(req: NextRequest) {
    const connection = await pool.getConnection();
    try {
        const { senderId, receiverId, content } = await req.json();
    
        if (!senderId || !receiverId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
    
        // Check if both users exist
        const [userCountResult] = await connection.execute<UserCountResult[]>(
            'SELECT COUNT(*) as count FROM users WHERE UserID IN (?, ?)',
            [senderId, receiverId]
        ); // Counts the number of users with the given IDs
        
        if (userCountResult[0].count !== 2) {
            return NextResponse.json({ error: 'Invalid sender or receiver' }, { status: 400 });
        }

        // Check if user is blocked
        const [blockedResult] = await connection.execute<UserCountResult[]>(
            'SELECT COUNT(*) as count FROM blocked_users WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)',
            [senderId, receiverId, receiverId, senderId]
        );

        if (blockedResult[0].count > 0) {
            return NextResponse.json({ error: 'You cannot send messages to this user' }, { status: 403 });
        }

        // If both users exist, proceed with inserting the message
        const [result] = await connection.execute(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [senderId, receiverId, content]
        );
    
        return NextResponse.json({ message: 'Message sent successfully' });
    } catch (error: any) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    } finally {
        connection.release();
    }
}