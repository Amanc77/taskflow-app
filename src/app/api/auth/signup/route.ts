import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body: { name: string; email: string; password: string } =
      await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString());

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to signup" },
      { status: 500 }
    );
  }
}
