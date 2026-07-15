export default function SidebarPanel({
  selectedGoal,
  onDeleteGoal,
  isDeletingGoal,
  onEditGoal,
  isEditingGoal,
}) {
  if (!selectedGoal) {
    return (
      <section className="details sidebar-empty">
        <h2>Select Goals to View Task</h2>
      </section>
    );
  }

  return (
    <section className="details">

      <div className="top-items" >
        <h2>Task</h2>
            <div className="top-buttons" >
                    <button
                      disabled={isEditingGoal}
                      onClick={onEditGoal}
                      type="button"
                    >
                      {isEditingGoal ? "Editing..." : "Edit"}
                    </button>
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

      <button className="complete">
        Complete Goal
      </button>
    </section>
  );
}