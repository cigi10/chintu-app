import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";
import { NOINDEX } from "@/lib/seo";

export const metadata = {
  title: "Studyloaf: Todo",
  description: "A kanban board for what you need to study.",
  robots: NOINDEX,
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