import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";
export default function TodoPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>To-do</h1>
        </div>
        <TodoList />
      </main>
    </div>
  );
}