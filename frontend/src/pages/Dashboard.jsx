import { useState } from "react";
import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";

export default function Dashboard() {
  const [isCompleteSelected, setIsCompleteSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleCompleteToggle = () => {
    setIsCompleteSelected((prev) => !prev);
  };

  const handleFilterChange = (filterKey) => {
    setSelectedFilter(filterKey);
  };

  return (
    <div className="container">
      <aside className="mainbar">
        <MainbarPanel
          isCompleteSelected={isCompleteSelected}
          onCompleteToggle={handleCompleteToggle}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
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