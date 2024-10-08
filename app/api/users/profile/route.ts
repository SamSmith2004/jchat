import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { pool } from '@/backend/src/config/database';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authConfig);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;
    const avatar = formData.get('avatar') as File;
    const banner = formData.get('banner') as File;

    let avatarPath = session.user.avatar;
    let bannerPath = session.user.banner;
    if (avatar) {
        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${session.user.id}-${Date.now()}.${avatar.type.split('/')[1]}`;
        avatarPath = `/uploads/${filename}`;
        const fullPath = path.join(process.cwd(), 'public', avatarPath);

        await mkdir(path.dirname(fullPath), { recursive: true });

        await writeFile(fullPath, buffer);
    }
    if (banner) {
        const bytes = await banner.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${session.user.id}-${Date.now()}.${banner.type.split('/')[1]}`;
        bannerPath = `/uploads/${filename}`;
        const fullPath = path.join(process.cwd(), 'public', bannerPath);

        await mkdir(path.dirname(fullPath), { recursive: true });

        await writeFile(fullPath, buffer);
    }

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE users SET username = ?, bio = ?, avatar = ?, banner = ? WHERE UserID = ?',
                [username, bio, avatarPath, bannerPath, session.user.id]
            );
            const [updatedUser] : any[] = await connection.query(
                'SELECT UserID, Username, Email, bio, avatar, banner FROM users WHERE UserID = ?',
                [session.user.id]
            );
            await connection.commit();

            try {
                session.user.username = username;
                session.user.bio = bio;
                if (avatar) {
                    const oldAvatar = session.user.avatar;
                    session.user.avatar = updatedUser[0].avatar;
                    if (oldAvatar && oldAvatar !== '/uploads/default-avatar.png') {
                        await unlink(path.join(process.cwd(), 'public', oldAvatar));
                    }
                }
                if (banner) {
                    const oldBanner = session.user.banner;
                    session.user.banner = updatedUser[0].banner;
                    if (oldBanner && oldBanner !== '/uploads/default-banner.png') {
                        await unlink(path.join(process.cwd(), 'public', oldBanner));
                    }
                }
            } catch {
                console.error('Failed to update session');
            }

            //console.log('api side data', updatedUser[0]);
            return NextResponse.json(updatedUser[0]);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}