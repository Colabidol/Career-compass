export default function SidebarPanel({ selectedGoal }) {
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
        <h2>{selectedGoal.title}</h2>
            <div className="top-buttons" >
                    <button>Edit</button>
                    <button className="delete">Delete</button>
            </div>
      </div>

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