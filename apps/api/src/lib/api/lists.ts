import { prisma as db } from "../prisma";

export interface List {
  id: string;
  title: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateListParams {
  userId: string;
  title: string;
  description?: string;
  color?: string;
}

interface UpdateListParams {
  userId: string;
  title?: string;
  description?: string;
  color?: string;
}

// GET - Fetch lists
export async function getLists(userId: string) {
  try {
    const lists = await db.list.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return lists;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw new Error("Failed to fetch lists");
  }
}

// POST - Create list
export async function createList(data: CreateListParams) {
  try {
    const { userId, ...listData } = data;

    const list = await db.list.create({
      data: {
        title: listData.title,
        description: listData.description,
        color: listData.color || "#6b7280",
        creatorId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return list;
  } catch (error) {
    console.error("Error creating list:", error);
    throw new Error("Failed to create list");
  }
}

// PUT - Update list
export async function updateList(id: string, data: UpdateListParams) {
  try {
    const { userId, ...updateFields } = data;

    const updateData: {
      updatedAt: Date;
      title?: string;
      description?: string;
      color?: string;
    } = {
      updatedAt: new Date(),
    };

    if (updateFields.title !== undefined) updateData.title = updateFields.title;
    if (updateFields.description !== undefined)
      updateData.description = updateFields.description;
    if (updateFields.color !== undefined) updateData.color = updateFields.color;
    const list = await db.list.update({
      where: {
        id,
        creatorId: userId,
      },
      data: updateData,
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return list;
  } catch (error) {
    console.error("Error updating list:", error);
    throw new Error("Failed to update list");
  }
}

// DELETE - Delete list
export async function deleteList(id: string, userId: string) {
  try {
    // First, remove the list association from all tasks in this list
    await db.task.updateMany({
      where: {
        listId: id,
        creatorId: userId,
      },
      data: {
        listId: null,
      },
    });

    // Then delete the list
    await db.list.delete({
      where: {
        id,
        creatorId: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting list:", error);
    throw new Error("Failed to delete list");
  }
}
