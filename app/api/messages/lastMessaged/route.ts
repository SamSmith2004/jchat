import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';
import { RowDataPacket } from 'mysql2';

interface LastMessagedUser extends RowDataPacket {
    UserID: number;
    Username: string;
    LastMessageTime: string;
}

export async function GET(req: NextRequest) {
    const connection = await pool.getConnection();
    try {
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const query = `
            SELECT 
                CASE 
                    WHEN m.sender_id = ? THEN m.receiver_id
                    ELSE m.sender_id
                END AS UserID,
                u.Username AS Username,
                MAX(m.timestamp) AS LastMessageTime
            FROM 
                messages AS m
            JOIN 
                users AS u ON (u.UserID = m.sender_id OR u.UserID = m.receiver_id) AND u.UserID != ?
            WHERE 
                m.sender_id = ? OR m.receiver_id = ?
            GROUP BY 
                UserID, Username
            ORDER BY 
                LastMessageTime DESC
            LIMIT 10
        `;

        const [results] = await connection.execute<LastMessagedUser[]>(query, [userId, userId, userId, userId]);

        if (results.length === 0) {
            return NextResponse.json({ 
                message: 'No conversations found',
                data: []
            });
        }

        return NextResponse.json({
            message: `Found ${results.length} recent conversation(s)`,
            data: results
        });

    } catch (error: any) {
        console.error('Error fetching last messaged users:', error);
        return NextResponse.json({ error: 'Failed to fetch last messaged users' }, { status: 500 });
    } finally {
        connection.release();
    }
}