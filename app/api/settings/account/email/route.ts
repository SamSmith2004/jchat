import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/backend/src/config/database'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth'

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authConfig);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const email = formData.get('email') as string;

    if (!email || !isValidEmail(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'UPDATE users SET email = ? WHERE UserID = ?',
            [email, session.user.id]
        );

        await connection.commit();

        try {
            session.user.email = email;
        } catch {
            console.error('Failed to update session');
        }

        return NextResponse.json({ email, message: 'Email updated successfully' }, { status: 200 });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Failed to update email:', error);
        return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}