import { ObjectId } from 'mongodb';

export interface Todo {
  _id?: ObjectId;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  createdAt: Date;
}

export type TodoStatus = 'all' | 'active' | 'completed';