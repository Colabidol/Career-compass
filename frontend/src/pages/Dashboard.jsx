import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="container">
      <aside className="mainbar">
        <MainbarPanel />
      </aside>

      <main className="foreground">
        <section className="task-list">
          <h1>GOALS</h1>
          <TaskCard />
          <TaskCard />
          <TaskCard />
        </section>
      </main>

      <aside className="sidebar">
        <SidebarPanel />
      </aside>
    </div>
  );
}