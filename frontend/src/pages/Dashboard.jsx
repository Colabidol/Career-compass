import { useEffect, useState } from "react";
import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";
import Goalform from "../components/Goalform";
import { createTask, deleteTask, getGoals } from "../services/api";

export default function Dashboard() {
  const [isCompleteSelected, setIsCompleteSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [isGoalformOpen, setIsGoalformOpen] = useState(false);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);

  const parseDueDateToIso = (dueDateText) => {
    if (!dueDateText) {
      return null;
    }

    const [month, day, year] = dueDateText.split("/").map(Number);
    if (!month || !day || !year) {
      return null;
    }

    return new Date(year, month - 1, day).toISOString();
  };

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

  const handleOpenGoalform = () => {
    setIsGoalformOpen(true);
  };

  const handleCloseGoalform = () => {
    setIsGoalformOpen(false);
  };

  const handleAddGoal = async (formValues) => {
    try {
      setIsSubmittingGoal(true);
      const createdGoal = await createTask({
        title: formValues.title,
        description: formValues.description,
        completed: false,
        category: formValues.category,
        priority: formValues.priority,
        due_date: parseDueDateToIso(formValues.dueDate),
      });

      const newGoal = {
        id: createdGoal.id,
        title: createdGoal.title,
        status: createdGoal.completed ? "complete" : "active",
        description: createdGoal.description || "",
        category: createdGoal.category || "Career",
        priority: createdGoal.priority || "medium",
        dueDate: createdGoal.due_date
          ? new Date(createdGoal.due_date).toLocaleDateString()
          : "No due date",
      };

      setGoals((prev) => [...prev, newGoal]);
      setSelectedGoalId(newGoal.id);
      setIsGoalformOpen(false);
    } catch (error) {
      console.error("Failed to create goal", error);
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) {
      return;
    }

    try {
      setIsDeletingGoal(true);
      await deleteTask(selectedGoal.id);

      setGoals((prev) => prev.filter((goal) => goal.id !== selectedGoal.id));
      setSelectedGoalId(null);
    } catch (error) {
      console.error("Failed to delete goal", error);
    } finally {
      setIsDeletingGoal(false);
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
          onAddGoal={handleOpenGoalform}
        />
      </aside>

      {isGoalformOpen ? (
        <Goalform
          isSubmitting={isSubmittingGoal}
          onCancel={handleCloseGoalform}
          onSubmitGoal={handleAddGoal}
        />
      ) : (
        <>
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
            <SidebarPanel
              isDeletingGoal={isDeletingGoal}
              onDeleteGoal={handleDeleteGoal}
              selectedGoal={selectedGoal}
            />
          </aside>
        </>
      )}
    </div>
  );
}