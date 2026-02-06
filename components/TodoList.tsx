'use client';

import { useState } from 'react';
import TodoItem from './TodoItem';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  createdAt: string;
}

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = initialTodos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  const activeCount = initialTodos.filter(t => t.status === 'active').length;
  const completedCount = initialTodos.filter(t => t.status === 'completed').length;

  return (
    <div className="todo-list-container">
      <div className="filter-bar">
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All ({initialTodos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === 'all' && "No tasks yet. Add one above to get started!"}
              {filter === 'active' && "No active tasks. Great job! 🎉"}
              {filter === 'completed' && "No completed tasks yet."}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              id={todo._id}
              title={todo.title}
              description={todo.description}
              status={todo.status}
              createdAt={todo.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
}