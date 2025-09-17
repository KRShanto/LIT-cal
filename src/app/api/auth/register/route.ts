import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password, username } = await request.json();

    // Check if all fields are provided
    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if password is at least n characters
    const passwordLength =
      (process.env.MIN_PASSWORD_LEN as number | undefined) || 6;
    if (password.length < passwordLength) {
      return NextResponse.json(
        {
          error: `Password must be at least ${passwordLength} characters`,
          field: "password",
        },
        { status: 400 }
      );
    }

    // Check if email or username already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: { id: true, email: true, username: true },
    });

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json(
          { error: "Email already in use", field: "email" },
          { status: 400 }
        );
      }
      if (existing.username === username) {
        return NextResponse.json(
          { error: "Username already taken", field: "username" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        passwordHash: hashedPassword,
      },
      select: { id: true, name: true, email: true, username: true },
    });

    return NextResponse.json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
