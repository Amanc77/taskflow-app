import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("No token in PUT request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string };
    console.log("Decoded user ID in PUT:", decoded.id);

    const task = await Task.findById(params.id);
    console.log(
      "Found task in PUT:",
      task?._id,
      "User in task:",
      task?.user.toString()
    );

    if (!task || task.user.toString() !== decoded.id) {
      console.log("PUT 404: Task not owned by user");
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    const data = await req.json();
    if (data.due_date) {
      data.due_date = new Date(data.due_date);
    }

    const updatedTask = await Task.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    const mappedTask = {
      ...updatedTask.toObject(),
      id: updatedTask._id.toString(),
      due_date: updatedTask.due_date
        ? updatedTask.due_date.toISOString()
        : null,
      created_at: updatedTask.created_at.toISOString(),
    };

    return NextResponse.json(mappedTask);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("No token in DELETE request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string };
    console.log("Decoded user ID in DELETE:", decoded.id);

    const task = await Task.findById(params.id);
    console.log(
      "Found task in DELETE:",
      task?._id,
      "User in task:",
      task?.user.toString()
    );

    if (!task || task.user.toString() !== decoded.id) {
      console.log("DELETE 404: Task not owned by user");
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    await Task.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
