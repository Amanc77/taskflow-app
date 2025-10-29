import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
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
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60, // 1 day
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
