// app/api/signup/route.ts

import { NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
 
    // Check if user already exists
    try {
      const [userCheck] : Array<any> = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (userCheck.length > 0) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      }
    } catch (error) {
      console.error('Error:', error);
      
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

    // Insert the new user
    
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Error:', error);
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}