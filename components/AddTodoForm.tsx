'use client';

import { useState } from 'react';
import { createTodo } from '@/actions/todo-actions';

export default function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    const result = await createTodo(formData);

    if (result.success) {
      setTitle('');
      setDescription('');
    } else {
      setError(result.error || 'Failed to create task');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="title-input"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="More details... (optional)"
          className="description-input"
          rows={3}
          disabled={isLoading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isLoading} className="add-btn">
        {isLoading ? 'Adding...' : '+ Add Task'}
      </button>
    </form>
  );
}