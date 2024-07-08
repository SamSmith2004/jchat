import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  database: 'jchat',
  port: 3306
});

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const [results] = await pool.execute(query, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}