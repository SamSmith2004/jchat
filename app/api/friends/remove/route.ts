import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { pool } from "@/backend/src/config/database";
import { authConfig } from "@/lib/auth";
import { CustomSession } from "@/app/types/customSession"

export async function POST(req : Request) {
    try{
        const session = await getServerSession(authConfig) as CustomSession | null;
        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { friendId } = await req.json();
        if (!friendId) {
            return NextResponse.json({ error: "Friend ID is required" }, { status: 400 });
        }
        const userId = session.user.id;

        const connection = await pool.getConnection();
        try {
            const [friendRequest]: any[] = await connection.query(
                'SELECT * FROM friend_requests WHERE (sender_id = ? AND receiver_id = ? AND status = "accepted") OR (sender_id = ? AND receiver_id = ? AND status = "accepted")',
                [userId, friendId, friendId, userId]
            );
            
            if (friendRequest.length === 0) {
                return NextResponse.json({ error: "No accepted friend request found" }, { status: 404 });
            }

            await connection.query(
                'DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ? AND status = "accepted") OR (sender_id = ? AND receiver_id = ? AND status = "accepted")',
                [userId, friendId, friendId, userId]
            );

            await connection.query(
                'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
                [userId, friendId, friendId, userId]
            );
            return NextResponse.json({ message: "Friend removed successfully" }, { status: 200 });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error removing friend:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}