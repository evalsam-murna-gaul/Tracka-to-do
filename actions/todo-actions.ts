'use server';

import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { Todo } from '@/types/todo';

const COLLECTION_NAME = 'todos';

export async function createTodo(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || title.trim() === '') {
      return { success: false, error: 'Title is required' };
    }

    const db = await getDatabase();
    const collection = db.collection<Todo>(COLLECTION_NAME);

    const newTodo: Omit<Todo, '_id'> = {
      title: title.trim(),
      description: description?.trim() || '',
      status: 'active',
      createdAt: new Date(),
    };

    await collection.insertOne(newTodo as Todo);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating todo:', error);
    return { success: false, error: 'Failed to create todo' };
  }
}

export async function getTodos(filter: 'all' | 'active' | 'completed' = 'all') {
  try {
    const db = await getDatabase();
    const collection = db.collection<Todo>(COLLECTION_NAME);

    const query = filter === 'all' ? {} : { status: filter };
    
    const todos = await collection
      .find(query)
      .sort({ createdAt: 1 })
      .toArray();

    // Convert ObjectId to string for client-side compatibility
    return todos.map(todo => ({
      ...todo,
      _id: todo._id!.toString(),
      createdAt: todo.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

export async function updateTodo(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || title.trim() === '') {
      return { success: false, error: 'Title is required' };
    }

    const db = await getDatabase();
    const collection = db.collection<Todo>(COLLECTION_NAME);

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title.trim(),
          description: description?.trim() || '',
        },
      }
    );

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating todo:', error);
    return { success: false, error: 'Failed to update todo' };
  }
}

export async function toggleTodoStatus(id: string, currentStatus: 'active' | 'completed') {
  try {
    const db = await getDatabase();
    const collection = db.collection<Todo>(COLLECTION_NAME);

    const newStatus = currentStatus === 'active' ? 'completed' : 'active';

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus } }
    );

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling todo status:', error);
    return { success: false, error: 'Failed to toggle status' };
  }
}

export async function deleteTodo(id: string) {
  try {
    const db = await getDatabase();
    const collection = db.collection<Todo>(COLLECTION_NAME);

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { success: false, error: 'Failed to delete todo' };
  }
}