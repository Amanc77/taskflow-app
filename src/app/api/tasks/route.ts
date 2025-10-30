import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id: string };

    const tasks = await Task.find({ user: decoded.id }).sort({
      created_at: -1,
    });
    const mappedTasks = tasks.map((task) => ({
      ...task.toObject(),
      id: task._id.toString(),
      due_date: task.due_date ? task.due_date.toISOString() : null,
      created_at: task.created_at.toISOString(),
    }));
    return NextResponse.json(mappedTasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id: string };

    const data = await req.json();
    const newTask = new Task({
      ...data,
      due_date: data.due_date ? new Date(data.due_date) : null,
      user: decoded.id,
    });
    await newTask.save();
    const mappedTask = {
      ...newTask.toObject(),
      id: newTask._id.toString(),
      due_date: newTask.due_date ? newTask.due_date.toISOString() : null,
      created_at: newTask.created_at.toISOString(),
    };
    return NextResponse.json(mappedTask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
