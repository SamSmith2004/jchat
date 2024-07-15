import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';

export async function GET(req: NextRequest) {
    const connection = await pool.getConnection();
    try {
        const userId = req.nextUrl.searchParams.get('userId');
        const friendId = req.nextUrl.searchParams.get('friendId');

        if (!userId || !friendId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const [messages] = await connection.execute(
            `SELECT * FROM messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?) 
             ORDER BY timestamp ASC`,
            [userId, friendId, friendId, userId]
        );

        return NextResponse.json(messages);
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    } finally {
        connection.release();
    }
}