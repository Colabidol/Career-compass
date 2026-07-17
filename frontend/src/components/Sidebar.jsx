export default function SidebarPanel({
  selectedGoal,
  onDeleteGoal,
  isDeletingGoal,
  onEditGoal,
  isEditingGoal,
  onToggleActivity,
  isSavingActivity,
  onCompleteGoal,
  isCompletingGoal,
}) {
  if (!selectedGoal) {
    // Empty state shown when no card is selected in the board.
    return (
      <section className="details sidebar-empty">
        <h2>Select Goals to View Task</h2>
      </section>
    );
  }

  const isCompletedGoal = selectedGoal.status === "complete";

  return (
    // Sidebar shows the selected goal details and the task actions.
    <section className="details">

      <div className="top-items" >
        <h2>Task</h2>
            <div className="top-buttons" >
                    {!isCompletedGoal ? (
                      <button
                        disabled={isEditingGoal}
                        onClick={onEditGoal}
                        type="button"
                      >
                        {isEditingGoal ? "Editing..." : "Edit"}
                      </button>
                    ) : null}
                    <button
                      className="delete"
                      disabled={isDeletingGoal}
                      onClick={onDeleteGoal}
                      type="button"
                    >
                      {isDeletingGoal ? "Deleting..." : "Delete"}
                    </button>
            </div>
      </div>

      <h3>{selectedGoal.title}</h3>
          {isCompletedGoal ? <span className="details-completed-badge">Completed</span> : null}

      <label>Description</label>

      <textarea
        value={selectedGoal.description}
        readOnly
      />

      <label>Category</label>

      <input value={selectedGoal.category} readOnly />

      <label>Priority</label>

      <input value={selectedGoal.priority} readOnly />

      <label>Due Date</label>

      <input value={selectedGoal.dueDate} readOnly />

      {!isCompletedGoal ? (
        <button
          className="complete activity-toggle"
          disabled={isSavingActivity}
          onClick={onToggleActivity}
          type="button"
        >
          {isSavingActivity
            ? "Saving..."
            : selectedGoal.activity === "inactive"
              ? "Mark Active"
              : "Mark Inactive"}
        </button>
      ) : null}

      {!isCompletedGoal ? (
        <button
          className="complete complete-goal-btn"
          disabled={isCompletingGoal}
          onClick={onCompleteGoal}
          type="button"
        >
          {isCompletingGoal ? "Completing..." : "Complete Goal"}
        </button>
      ) : null}
    </section>
  );
}