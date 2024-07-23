import { NextResponse } from 'next/server';
import { pool } from '@/backend/src/config/database';
import bcrypt from 'bcrypt';

function passwordStrengthTest(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*)';
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check if user already exists
    const [userCheck]: Array<any> = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (userCheck.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Check password strength
    const passwordError = passwordStrengthTest(password);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
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