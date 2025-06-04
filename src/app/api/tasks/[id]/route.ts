import { NextRequest, NextResponse } from "next/server";
import { updateTodo, deleteTodo, toggleTodoComplete } from "@/lib/api/todos";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const params = await context.params;
    const { id } = params;

    const todo = await updateTodo(id, body);

    return NextResponse.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    await deleteTodo(id);

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const todo = await toggleTodoComplete(id);

    return NextResponse.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle todo completion" },
      { status: 500 }
    );
  }
}
