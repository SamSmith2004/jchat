import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { executeQuery } from '@/backend/src/config/database';

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await executeQuery<any[]>(
      `SELECT 
        m.sender_id, 
        u.Username as sender_name, 
        COUNT(*) as message_count, 
        MAX(m.timestamp) as latest_timestamp
       FROM messages m
       JOIN users u ON m.sender_id = u.UserID
       WHERE m.receiver_id = ? AND m.status = 'unread'
       GROUP BY m.sender_id, u.Username
       ORDER BY latest_timestamp DESC
       LIMIT 10`,
      [session.user.id]
    );

    //console.log('SQL notifications result:', notifications);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sender_id } = await request.json();

    await executeQuery(
      `UPDATE messages SET status = 'read'
       WHERE sender_id = ? AND receiver_id = ?`,
      [sender_id, session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}