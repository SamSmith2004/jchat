import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import Redis from 'ioredis';

const redis = new Redis({
  host: '100.106.217.25',
  port: 30036
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    let theme = await redis.get(`theme:${userId}`);
    if (!theme) {
      theme = 'dark'; 
      await redis.set(`theme:${userId}`, theme);
    }
    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Failed to fetch theme:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { theme } = await req.json();

  if (!theme || (theme !== 'dark' && theme !== 'light')) {
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
  }

  try {
    await redis.set(`theme:${userId}`, theme);
    return NextResponse.json({ message: 'Theme updated successfully' });
  } catch (error) {
    console.error('Failed to update theme:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}