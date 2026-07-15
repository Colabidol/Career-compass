import { useState } from "react";
import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";

export default function Dashboard() {
  const [isCompleteSelected, setIsCompleteSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [goals, setGoals] = useState([]);

  const visibleGoals = goals.filter((goal) => {
    if (isCompleteSelected && goal.status !== "complete") {
      return false;
    }

    if (selectedFilter === "all") {
      return true;
    }

    return goal.status === selectedFilter;
  });

  const handleCompleteToggle = () => {
    setIsCompleteSelected((prev) => !prev);
  };

  const handleFilterChange = (filterKey) => {
    setSelectedFilter(filterKey);
  };

  const handleAddGoal = () => {
    const nextGoalNumber = goals.length + 1;

    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: `Career Goal ${nextGoalNumber}`,
        status: "active",
      },
    ]);
  };

  return (
    <div className="container">
      <aside className="mainbar">
        <MainbarPanel
          isCompleteSelected={isCompleteSelected}
          onCompleteToggle={handleCompleteToggle}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onAddGoal={handleAddGoal}
        />
      </aside>

      <main className="foreground">
        <section className="task-list">
          <h1>GOALS</h1>
          {visibleGoals.length === 0 ? (
            <div className="empty-state">
              <h2>No Goals Yet.</h2>
              <p>Click "+ Add Goal" to create your first career goal.</p>
            </div>
          ) : (
            visibleGoals.map((goal) => <TaskCard key={goal.id} />)
          )}
        </section>
      </main>

      <aside className="sidebar">
        <SidebarPanel />
      </aside>
    </div>
  );
}