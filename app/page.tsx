import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';
import { getTodos } from '@/actions/todo-actions';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const todos = await getTodos('all');

  return (
    <>
    <header className="header">
        <Image src="/TRACKA.png" alt="logo" width={120} height={60}/>

        <p className="subtitle">Track all your tasks with me!📝</p>
      </header>
    <main className="container">
      <div className="content">
        <section className="add-section">
          <h2>Add New Task</h2>
          <AddTodoForm />
        </section>

        <section className="list-section">
          <h2>Tasks</h2>
          <TodoList initialTodos={todos} />
        </section>
      </div>

      <footer className="footer">
        <p>Built by Evalsam. © 2026</p>
      </footer>
    </main>
  </>
  );
}