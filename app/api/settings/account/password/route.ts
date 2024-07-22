import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/backend/src/config/database'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth'
import bcrypt from 'bcrypt';

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authConfig);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await req.formData();
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    if (!oldPassword || !newPassword) {
        return NextResponse.json({ error: 'Missing password' }, { status: 400 });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [rows] : any = await connection.query('SELECT Password FROM users WHERE UserID = ?', [session.user.id]);
        
        if (rows.length === 0) {
            await connection.rollback();
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(oldPassword, user.Password);

        if (!isValid) {
            await connection.rollback();
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.query('UPDATE users SET Password = ? WHERE UserID = ?', [hashedPassword, session.user.id]);
        await connection.commit();

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Failed to update password:', error);
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}