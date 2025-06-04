import { NextRequest, NextResponse } from "next/server";
import { createTodo, getTodos } from "@/lib/api/todos";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      priority: (searchParams.get("priority") as any) || undefined,
      status: (searchParams.get("status") as any) || undefined,
      limit: Number(searchParams.get("limit")) || 50,
      offset: Number(searchParams.get("offset")) || 0,
      sortBy:
        (searchParams.get("sortBy") as "order" | "dueDate" | "createdAt") ||
        undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
      filterToday: searchParams.get("filterToday") === "true",
    };

    const todos = await getTodos(params);

    return NextResponse.json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, description, isUrgent, isImportant, isCompleted, dueDate } =
      body;

    if (!title || isUrgent === undefined || isImportant === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, isUrgent, and isImportant are required",
        },
        { status: 400 }
      );
    }

    const todo = await createTodo({
      title,
      description,
      isUrgent: Boolean(isUrgent),
      isImportant: Boolean(isImportant),
      isCompleted: Boolean(isCompleted),
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return NextResponse.json(
      {
        success: true,
        data: todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
