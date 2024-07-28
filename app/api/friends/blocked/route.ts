import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { pool } from "@/backend/src/config/database";
import { authConfig } from "@/lib/auth";
import { CustomSession } from "@/app/types/customSession"

export async function GET(req : Request) {
    const session = await getServerSession(authConfig) as CustomSession | null;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session?.user.id;
    
    try {
        const [blockedUsers] = await pool.query(
            `SELECT u.UserID, u.Username 
             FROM blocked_users b 
             JOIN users u ON b.blocked_id = u.UserID 
             WHERE b.blocker_id = ?`,
            [userId]
        );

        return NextResponse.json(blockedUsers);
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        return NextResponse.json({ error: 'Failed to fetch blocked users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authConfig) as CustomSession | null;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { blockedId } = await req.json();

    if (!blockedId) {
        return NextResponse.json({ error: 'Blocked user ID is required' }, { status: 400 });
    }

    try {
        // Check if both users exist
        const [users] = await pool.query(
            'SELECT UserID FROM users WHERE UserID IN (?, ?)',
            [userId, blockedId]
        ) as any[];
        
        if (users.length !== 2) {
            return NextResponse.json({ error: 'One or both users do not exist' }, { status: 400 });
        }

        const [existingBlock] = await pool.query(
            'SELECT id FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
            [userId, blockedId]
        ) as any[];

        if (existingBlock.length > 0) {
            return NextResponse.json({ error: 'User is already blocked' }, { status: 400 });
        }

        await pool.query(
            'INSERT INTO blocked_users (blocker_id, blocked_id) VALUES (?, ?)',
            [userId, blockedId]
        );

        return NextResponse.json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        return NextResponse.json({ error: 'Failed to block user' }, { status: 500 });
    }
}