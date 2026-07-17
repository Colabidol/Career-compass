import { useEffect, useState } from "react";
import MainbarPanel from "../components/Mainbar";
import TaskCard from "../components/Card";
import SidebarPanel from "../components/Sidebar";
import Goalform from "../components/Goalform";
import { createTask, deleteTask, getGoals, markTaskComplete, updateTask } from "../services/api";

export default function Dashboard() {
  // Dashboard owns the task board state: loading, filters, selection, edits, and API mutations.
  const [isCompleteSelected, setIsCompleteSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [isGoalformOpen, setIsGoalformOpen] = useState(false);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);
  const [isCompletingGoal, setIsCompletingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  useEffect(() => {
    if (!celebration) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCelebration(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [celebration]);

  const parseDueDateToIso = (dueDateText) => {
    if (!dueDateText) {
      return null;
    }

    const [month, day, year] = dueDateText.split("/").map(Number);
    if (!month || !day || !year) {
      return null;
    }

    const paddedMonth = String(month).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");

    // Keep due dates timezone-agnostic by sending a local datetime string (no UTC conversion).
    return `${year}-${paddedMonth}-${paddedDay}T00:00:00`;
  };

  const formatDueDateForDisplay = (dueDateValue) => {
    if (!dueDateValue) {
      return "No due date";
    }

    const [yearText, monthText, dayText] = String(dueDateValue).split("T")[0].split("-");
    const yearNumber = Number(yearText);
    const monthNumber = Number(monthText);
    const dayNumber = Number(dayText);

    if (!yearNumber || !monthNumber || !dayNumber) {
      return "No due date";
    }

    return `${monthNumber}/${dayNumber}/${yearNumber}`;
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

  const getErrorText = (error, fallbackMessage) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallbackMessage;
  };

  useEffect(() => {
    // Fetch and normalize goals once on mount so the UI works with a stable view model.
    const loadGoals = async () => {
      try {
        setErrorMessage("");
        const data = await getGoals();
        const mappedGoals = data.map((goal) => ({
          id: goal.id,
          title: goal.title,
          status: goal.completed ? "complete" : "active",
          activity: normalizeActivity(goal.filter),
          description: goal.description || "",
          category: goal.category || "Career",
          priority: formatPriorityLabel(goal.priority),
          dueDate: formatDueDateForDisplay(goal.due_date),
        }));

        setGoals(mappedGoals);
      } catch (error) {
        setErrorMessage(getErrorText(error, "Failed to load goals."));
      } finally {
        setIsLoadingGoals(false);
      }
    };

    loadGoals();
  }, []);

  const visibleGoals = goals.filter((goal) => {
    // Search and filter combine here before the cards are rendered.
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
    setSelectedFilter("all");
    setIsCompleteSelected(false);
    setEditingGoalId(null);
    setDeleteCandidate(null);
    setIsGoalformOpen(true);
  };

  const handleCloseGoalform = () => {
    setEditingGoalId(null);
    setIsGoalformOpen(false);
  };

  const handleAddGoal = async (formValues) => {
    // Submit both create and edit flows through the same payload builder.
    try {
      setIsSubmittingGoal(true);
      setErrorMessage("");
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
        dueDate: formatDueDateForDisplay(savedGoal.due_date),
      };

      setGoals((prev) =>
        editingGoalId
          ? prev.map((goal) => (goal.id === editingGoalId ? normalizedGoal : goal))
          : [...prev, normalizedGoal]
      );
      setSelectedGoalId(normalizedGoal.id);
      setEditingGoalId(null);
      setIsGoalformOpen(false);

      if (editingGoalId) {
        setCelebration({
          kind: "edit",
          icon: "✨",
          title: "Changes Saved",
        });
      } else {
        setCelebration({
          kind: "create",
          icon: "🎉",
          label: "Goal created",
          title: normalizedGoal.title,
          message: "Your new goal is ready. Nice work getting it started.",
        });
      }
    } catch (error) {
      setErrorMessage(
        getErrorText(error, editingGoalId ? "Failed to update goal." : "Failed to create goal.")
      );
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) {
      return;
    }

    if (isDeletingGoal) {
      return;
    }

    setDeleteCandidate({
      id: selectedGoal.id,
      title: selectedGoal.title,
    });
  };

  const handleCancelDelete = () => {
    if (isDeletingGoal) {
      return;
    }

    setDeleteCandidate(null);
  };

  const handleConfirmDeleteGoal = async () => {
    if (!deleteCandidate) {
      return;
    }

    try {
      setIsDeletingGoal(true);
      setErrorMessage("");
      await deleteTask(deleteCandidate.id);

      setGoals((prev) => prev.filter((goal) => goal.id !== deleteCandidate.id));
      setSelectedGoalId((currentSelectedGoalId) =>
        currentSelectedGoalId === deleteCandidate.id ? null : currentSelectedGoalId
      );
      setDeleteCandidate(null);
      setCelebration({
        kind: "delete",
        icon: "🗑️",
        title: "Goal Deleted",
        message: "The goal was removed successfully.",
      });
    } catch (error) {
      setErrorMessage(getErrorText(error, "Failed to delete goal."));
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
      setErrorMessage("");
      const updatedGoal = await markTaskComplete(selectedGoal.id, true);

      const normalizedGoal = {
        id: updatedGoal.id,
        title: updatedGoal.title,
        status: updatedGoal.completed ? "complete" : "active",
        activity: normalizeActivity(updatedGoal.filter),
        description: updatedGoal.description || "",
        category: updatedGoal.category || "Career",
        priority: formatPriorityLabel(updatedGoal.priority),
        dueDate: formatDueDateForDisplay(updatedGoal.due_date),
      };

      setGoals((prev) =>
        prev.map((goal) => (goal.id === updatedGoal.id ? normalizedGoal : goal))
      );
      setSelectedGoalId(updatedGoal.id);
      setCelebration({
        kind: "complete",
        icon: "🏆",
        label: "Goal completed",
        title: updatedGoal.title,
        message: "Great job. That milestone is officially done.",
      });
    } catch (error) {
      setErrorMessage(getErrorText(error, "Failed to complete goal."));
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
      setErrorMessage("");
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
        dueDate: formatDueDateForDisplay(updatedGoal.due_date),
      };

      setGoals((prev) =>
        prev.map((goal) => (goal.id === updatedGoal.id ? normalizedGoal : goal))
      );
      setSelectedGoalId(updatedGoal.id);
    } catch (error) {
      setErrorMessage(getErrorText(error, "Failed to update goal activity."));
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
      {deleteCandidate ? (
        <div className="delete-confirmation-overlay" role="dialog" aria-modal="true">
          <section className="delete-confirmation-card" aria-labelledby="delete-goal-title">
            <p className="delete-confirmation-label">Delete Confirmation</p>
            <h2 id="delete-goal-title">Delete this goal?</h2>
            <p className="delete-confirmation-message">
              Are you sure you want to delete "{deleteCandidate.title}"? This action cannot be
              undone.
            </p>
            <div className="delete-confirmation-actions">
              <button
                className="delete-confirmation-cancel"
                disabled={isDeletingGoal}
                onClick={handleCancelDelete}
                type="button"
              >
                Cancel
              </button>
              <button
                className="delete-confirmation-delete"
                disabled={isDeletingGoal}
                onClick={handleConfirmDeleteGoal}
                type="button"
              >
                {isDeletingGoal ? "Deleting..." : "Delete Goal"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="error-banner" role="alert">
          <p>{errorMessage}</p>
          <button
            aria-label="Dismiss error"
            onClick={() => setErrorMessage("")}
            type="button"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {celebration ? (
        <div className="goal-completion-celebration" role="status" aria-live="polite">
          <div
            className={`goal-completion-celebration-card ${celebration.kind === "edit" ? "goal-completion-celebration-card-minimal" : ""} ${celebration.kind === "delete" ? "goal-completion-celebration-card-delete" : ""}`.trim()}
          >
            <div className="goal-completion-celebration-icon" aria-hidden="true">
              {celebration.icon}
            </div>
            {celebration.label ? (
              <p className="goal-completion-celebration-label">{celebration.label}</p>
            ) : null}
            <h2>{celebration.title}</h2>
            {celebration.message ? <p>{celebration.message}</p> : null}
            <div className="goal-completion-confetti" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      ) : null}

      <aside className="mainbar">
        <MainbarPanel
          isCompleteSelected={isCompleteSelected}
          isGoalformOpen={isGoalformOpen}
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
          key={editingGoalId ?? "new-goal"}
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
                    key={`${goal.id}-${selectedFilter}-${isCompleteSelected}`}
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
              key={selectedGoalId ?? "empty"}
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