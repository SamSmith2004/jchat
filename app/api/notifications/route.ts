import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { executeQuery } from '@/backend/src/config/database';

export async function GET() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user?.id) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Fetching notifications for user ID:', session.user.id);

  try {
    const notifications = await executeQuery<any[]>(
      `SELECT m.id, m.content, m.timestamp, u.Username as sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.UserID
       WHERE m.receiver_id = ? AND m.status = 'unread'
       ORDER BY m.timestamp DESC
       LIMIT 10`,
      [session.user.id]
    );

    console.log('Raw notifications result:', notifications);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messageId } = await request.json();

    await executeQuery(
      `UPDATE messages SET status = 'read'
       WHERE id = ? AND receiver_id = ?`,
      [messageId, session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}