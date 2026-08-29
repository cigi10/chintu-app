import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";

export const metadata = {
  title: "Studyloaf: Todo",
  description: "A kanban board for what you need to study.",
};

export default function TodoPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Todo</h1>
        </div>
        <TodoList />
      </main>
    </div>
  );
}