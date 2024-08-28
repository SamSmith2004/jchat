import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const [rows]: any[] = await pool.query('SELECT theme FROM user_themes WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }
        return NextResponse.json({ theme: rows[0].theme });
    } catch (error) {
        console.error('Failed to fetch theme:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { theme } = await req.json();
    if (!theme || (theme !== 'dark' && theme !== 'light')) {
        return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    try {
        const [result] : any[] = await pool.query(
            'INSERT INTO user_themes (user_id, theme) VALUES (?, ?) ON DUPLICATE KEY UPDATE theme = VALUES(theme)',
            [userId, theme]
        );
        return NextResponse.json({ message: 'Theme updated successfully' });
    } catch (error) {
        console.error('Failed to update theme:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}