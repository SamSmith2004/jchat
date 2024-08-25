import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/backend/src/config/database";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const userIdCheck = await req.json();
  if (userId !== userIdCheck.toString()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userExists]: any[] = await connection.query(
      "SELECT 1 FROM users WHERE UserID = ?",
      [userId],
    );

    if (!userExists.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await connection.query("DELETE FROM messages WHERE sender_id = ?", [
      userId,
    ]);
    await connection.query(
      "DELETE FROM friends WHERE user_id = ? OR friend_id = ?",
      [userId, userId],
    );

    await connection.query(
      "DELETE FROM friend_requests WHERE sender_id = ? OR receiver_id = ?",
      [userId, userId],
    );

    const [result] = await connection.query(
      "DELETE FROM users WHERE UserID = ?",
      [userId],
    );

    await connection.commit();

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    await connection.rollback();
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
}
