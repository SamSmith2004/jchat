import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  database: 'jchat',
  port: 3306
});

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    console.log('Executing query:', query, 'with params:', params);
    const [results] = await pool.execute(query, params);
    console.log('Query results:', results);
    return results as T; // Type assertion
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}