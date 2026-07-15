import { useEffect, useState } from "react";
import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";
import { createTask, getGoals } from "../services/api";

export default function Dashboard() {
  const [isCompleteSelected, setIsCompleteSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await getGoals();
        const mappedGoals = data.map((goal) => ({
          id: goal.id,
          title: goal.title,
          status: goal.completed ? "complete" : "active",
          description: goal.description || "",
          category: goal.category || "Career",
          priority: goal.priority || "Medium",
          dueDate: goal.due_date ? new Date(goal.due_date).toLocaleDateString() : "No due date",
        }));

        setGoals(mappedGoals);
      } catch (error) {
        console.error("Failed to fetch goals", error);
      } finally {
        setIsLoadingGoals(false);
      }
    };

    loadGoals();
  }, []);

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

  const handleAddGoal = async () => {
    try {
    const nextGoalNumber = goals.length + 1;
    const createdGoal = await createTask({
      title: `Career Goal ${nextGoalNumber}`,
      description: "Goal details coming soon.",
      completed: false,
      category: "Career",
      priority: "High",
      due_date: null,
    });

    const newGoal = {
      id: createdGoal.id,
      title: createdGoal.title,
      status: createdGoal.completed ? "complete" : "active",
      description: createdGoal.description || "",
      category: createdGoal.category || "Career",
      priority: createdGoal.priority || "Medium",
      dueDate: createdGoal.due_date
        ? new Date(createdGoal.due_date).toLocaleDateString()
        : "No due date",
    };

    setGoals((prev) => [...prev, newGoal]);
    setSelectedGoalId(newGoal.id);
    } catch (error) {
      console.error("Failed to create goal", error);
    }
  };

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) || null;

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
          {isLoadingGoals ? (
            <div className="empty-state">
              <h2>Loading Goals...</h2>
            </div>
          ) : visibleGoals.length === 0 ? (
            <div className="empty-state">
              <h2>No Goals Yet.</h2>
              <p>Click "+ Add Goal" to create your first career goal.</p>
            </div>
          ) : (
            visibleGoals.map((goal) => (
              <TaskCard
                key={goal.id}
                goal={goal}
                isSelected={selectedGoalId === goal.id}
                onSelect={() => setSelectedGoalId(goal.id)}
              />
            ))
          )}
        </section>
      </main>

      <aside className="sidebar">
        <SidebarPanel selectedGoal={selectedGoal} />
      </aside>
    </div>
  );
}