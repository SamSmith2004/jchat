import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, pool } from '@/backend/src/config/database';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const connection = await pool.getConnection();
    try {
        

    } catch (error : any) {
        await connection.rollback(); // Rollback any changes if an error occurs during the transaction
        
        console.error('Error rejecting friend request:', error);
        return NextResponse.json({ error: 'Failed to reject friend request', details: error.message }, { status: 500 });

    } finally {
        connection.release();
    }
}