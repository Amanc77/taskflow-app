import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import { connectDB } from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: { email: string; password: string } = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("name email password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Incorrect email or password" },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect email or password" },
        { status: 400 }
      );
    }

    const token = generateToken(user._id.toString());

    const response = NextResponse.json({
      success: true,
      message: `Welcome back ${user.name}`,
      user: { _id: user._id, name: user.name, email: user.email },
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
      { success: false, message: "Failed to login" },
      { status: 500 }
    );
  }
}
