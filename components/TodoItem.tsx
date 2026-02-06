'use client';

import { useState } from 'react';
import { toggleTodoStatus, updateTodo, deleteTodo } from '@/actions/todo-actions';

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export default function TodoItem({ id, title, description, status, createdAt }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    await toggleTodoStatus(id, status);
    setIsLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('description', editDescription);

    const result = await updateTodo(id, formData);
    if (result.success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    await deleteTodo(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title-input"
            placeholder="Task title"
            autoFocus
            disabled={isLoading}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-description-input"
            placeholder="Description (optional)"
            rows={3}
            disabled={isLoading}
          />
          <div className="edit-actions">
            <button type="submit" disabled={isLoading} className="save-btn">
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setEditTitle(title);
                setEditDescription(description || '');
                setIsEditing(false);
              }}
              disabled={isLoading}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`todo-item ${status}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={status === 'completed'}
          onChange={handleToggleStatus}
          disabled={isLoading}
          aria-label={`Mark ${title} as ${status === 'active' ? 'completed' : 'active'}`}
        />
      </div>
      
      <div className="todo-content">
        <h3 className="todo-title">{title}</h3>
        {description && <p className="todo-description">{description}</p>}
        <span className="todo-date">{formatDate(createdAt)}</span>
      </div>

      <div className="todo-actions">
        <button 
          onClick={() => setIsEditing(true)} 
          disabled={isLoading}
          className="edit-btn"
          aria-label="Edit task"
        >
          Edit  
        </button>
        <button 
          onClick={handleDelete} 
          disabled={isLoading}
          className="delete-btn"
          aria-label="Delete task"
        >
          Delete 
        </button>
      </div>
    </div>
  );
}