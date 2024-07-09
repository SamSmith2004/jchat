import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/backend/src/config/database';

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get('username');
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const query = 'SELECT UserID FROM users WHERE username = ?';
    const results = await executeQuery<{ UserID: number }[]>(query, [username]);

    //console.log('Query results:', results); 

    if (results.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ id: results[0].UserID });
   
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}