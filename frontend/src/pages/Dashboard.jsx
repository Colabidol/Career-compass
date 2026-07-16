import { useEffect, useState } from "react";
import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";
import Goalform from "../components/Goalform";
import { createTask, deleteTask, getGoals, updateTask } from "../services/api";

export default function Dashboard() {
  const [isCompleteSelected, setIsCompleteSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [isGoalformOpen, setIsGoalformOpen] = useState(false);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);
  const [isCompletingGoal, setIsCompletingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);

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

  const formatPriorityLabel = (priorityValue) => {
    if (!priorityValue) {
      return "Medium";
    }

    return priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1).toLowerCase();
  };

  const normalizeActivity = (filterValue) => {
    if (!filterValue) {
      return "active";
    }

    const normalizedFilter = filterValue.toLowerCase();
    return normalizedFilter === "inactive" ? "inactive" : "active";
  };

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await getGoals();
        const mappedGoals = data.map((goal) => ({
          id: goal.id,
          title: goal.title,
          status: goal.completed ? "complete" : "active",
          activity: normalizeActivity(goal.filter),
          description: goal.description || "",
          category: goal.category || "Career",
          priority: formatPriorityLabel(goal.priority),
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
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const matchesSearch = normalizedSearchTerm
      ? goal.title.toLowerCase().includes(normalizedSearchTerm)
      : true;

    if (!matchesSearch) {
      return false;
    }

    if (isCompleteSelected) {
      return goal.status === "complete";
    }

    if (goal.status === "complete") {
      return false;
    }

    if (selectedFilter === "all") {
      return true;
    }

    return goal.activity === selectedFilter;
  });

  const handleCompleteToggle = () => {
    setSelectedFilter("all");
    setIsCompleteSelected((prev) => !prev);
  };

  const handleFilterChange = (filterKey) => {
    setSelectedFilter(filterKey);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleOpenGoalform = () => {
    setEditingGoalId(null);
    setIsGoalformOpen(true);
  };

  const handleCloseGoalform = () => {
    setEditingGoalId(null);
    setIsGoalformOpen(false);
  };

  const handleAddGoal = async (formValues) => {
    try {
      setIsSubmittingGoal(true);
      const goalPayload = {
        title: formValues.title,
        description: formValues.description,
        completed: editingGoalId ? selectedGoal?.status === "complete" : false,
        filter: editingGoalId ? selectedGoal?.activity || "active" : "active",
        category: formValues.category,
        priority: formValues.priority,
        due_date: parseDueDateToIso(formValues.dueDate),
      };

      const savedGoal = editingGoalId
        ? await updateTask(editingGoalId, goalPayload)
        : await createTask(goalPayload);

      const normalizedGoal = {
        id: savedGoal.id,
        title: savedGoal.title,
        status: savedGoal.completed ? "complete" : "active",
        activity: normalizeActivity(savedGoal.filter),
        description: savedGoal.description || "",
        category: savedGoal.category || "Career",
        priority: formatPriorityLabel(savedGoal.priority),
        dueDate: savedGoal.due_date
          ? new Date(savedGoal.due_date).toLocaleDateString()
          : "No due date",
      };

      setGoals((prev) =>
        editingGoalId
          ? prev.map((goal) => (goal.id === editingGoalId ? normalizedGoal : goal))
          : [...prev, normalizedGoal]
      );
      setSelectedGoalId(normalizedGoal.id);
      setEditingGoalId(null);
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

  const handleEditGoal = () => {
    if (!selectedGoal) {
      return;
    }

    setEditingGoalId(selectedGoal.id);
    setIsGoalformOpen(true);
  };

  const handleCompleteGoal = async () => {
    if (!selectedGoal || selectedGoal.status === "complete") {
      return;
    }

    try {
      setIsCompletingGoal(true);
      const updatedGoal = await updateTask(selectedGoal.id, {
        completed: true,
      });

      const normalizedGoal = {
        id: updatedGoal.id,
        title: updatedGoal.title,
        status: updatedGoal.completed ? "complete" : "active",
        activity: normalizeActivity(updatedGoal.filter),
        description: updatedGoal.description || "",
        category: updatedGoal.category || "Career",
        priority: formatPriorityLabel(updatedGoal.priority),
        dueDate: updatedGoal.due_date
          ? new Date(updatedGoal.due_date).toLocaleDateString()
          : "No due date",
      };

      setGoals((prev) =>
        prev.map((goal) => (goal.id === updatedGoal.id ? normalizedGoal : goal))
      );
      setSelectedGoalId(updatedGoal.id);
    } catch (error) {
      console.error("Failed to complete goal", error);
    } finally {
      setIsCompletingGoal(false);
    }
  };

  const handleToggleActivity = async () => {
    if (!selectedGoal || selectedGoal.status === "complete") {
      return;
    }

    const nextActivity = selectedGoal.activity === "inactive" ? "active" : "inactive";

    try {
      setIsSubmittingGoal(true);
      const updatedGoal = await updateTask(selectedGoal.id, {
        filter: nextActivity,
      });

      const normalizedGoal = {
        id: updatedGoal.id,
        title: updatedGoal.title,
        status: updatedGoal.completed ? "complete" : "active",
        activity: normalizeActivity(updatedGoal.filter),
        description: updatedGoal.description || "",
        category: updatedGoal.category || "Career",
        priority: formatPriorityLabel(updatedGoal.priority),
        dueDate: updatedGoal.due_date
          ? new Date(updatedGoal.due_date).toLocaleDateString()
          : "No due date",
      };

      setGoals((prev) =>
        prev.map((goal) => (goal.id === updatedGoal.id ? normalizedGoal : goal))
      );
      setSelectedGoalId(updatedGoal.id);
    } catch (error) {
      console.error("Failed to update goal activity", error);
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) || null;
  const editingGoal = goals.find((goal) => goal.id === editingGoalId) || null;
  const goalsHeading = isCompleteSelected
    ? "Completed Goals"
    : selectedFilter === "active"
      ? "Active Goals"
      : selectedFilter === "inactive"
        ? "Inactive Goals"
        : "Goals";

  return (
    <div className="container">
      <aside className="mainbar">
        <MainbarPanel
          isCompleteSelected={isCompleteSelected}
          onCompleteToggle={handleCompleteToggle}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onAddGoal={handleOpenGoalform}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </aside>

      {isGoalformOpen ? (
        <Goalform
          initialValues={editingGoal}
          isSubmitting={isSubmittingGoal}
          onCancel={handleCloseGoalform}
          onSubmitGoal={handleAddGoal}
          submitLabel={editingGoalId ? "Update Goal" : "Save Goal"}
          title={editingGoalId ? "Edit Goal" : "Create Goal"}
        />
      ) : (
        <>
          <main className="foreground">
            <section className="task-list">
              <h1>{goalsHeading}</h1>
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
                    showActivityBadge={selectedFilter === "all" && !isCompleteSelected}
                    onSelect={() =>
                      setSelectedGoalId((currentSelectedGoalId) =>
                        currentSelectedGoalId === goal.id ? null : goal.id
                      )
                    }
                  />
                ))
              )}
            </section>
          </main>

          <aside className="sidebar">
            <SidebarPanel
              isSavingActivity={isSubmittingGoal}
              isCompletingGoal={isCompletingGoal}
              isEditingGoal={isGoalformOpen}
              isDeletingGoal={isDeletingGoal}
              onToggleActivity={handleToggleActivity}
              onCompleteGoal={handleCompleteGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={handleDeleteGoal}
              selectedGoal={selectedGoal}
            />
          </aside>
        </>
      )}
    </div>
  );
}