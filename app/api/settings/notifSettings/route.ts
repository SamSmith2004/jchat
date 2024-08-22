import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { pool } from '@/backend/src/config/database';

export async function GET() {
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
        const user_id = session.user.id;

        const [rows] : any[] = await pool.query(
            `SELECT notifAudio FROM users WHERE UserID = ?`,
            [user_id]
        );

        //console.log('Rows:', rows[0]);
        return NextResponse.json(rows[0]);
    } catch (error) {
      console.error('Error fetching notif settings:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } 
}

export async function PUT(request: Request) {
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const input = await request.json();
        const user_id = session.user.id;

        const [result]: any[] = await pool.query(
            `UPDATE users SET notifAudio = NOT notifAudio WHERE UserID = ?`,
            [user_id]
        );

        if (result.affectedRows === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json(!input.notifAudio);
    } catch (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}