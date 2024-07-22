import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/backend/src/config/database'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth'

function isValidPhoneNumber(phone: string): boolean {
    // This is a basic regex for international phone numbers
    // It allows for an optional '+' at the start, followed by 7 to 15 digits
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return phoneRegex.test(phone);
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authConfig);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const phone = formData.get('phone') as string;

    if (phone && !isValidPhoneNumber(phone)) {
        return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'UPDATE users SET phone = ? WHERE UserID = ?',
            [phone, session.user.id]
        );

        await connection.commit();

        try {
            session.user.phone = phone;
        } catch {
            console.error('Failed to update session');
        }

        return NextResponse.json({ phone, message: 'Phone num updated successfully' }, { status: 200 });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Failed to update phone num:', error);
        return NextResponse.json({ error: 'Failed to update phone num' }, { status: 500 });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}