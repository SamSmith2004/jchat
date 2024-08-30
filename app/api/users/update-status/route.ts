import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, status } = await request.json();

  if (userId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch('http://localhost:8080/api/user-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}