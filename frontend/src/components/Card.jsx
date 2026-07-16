export default function TaskCard({ goal, isSelected, onSelect, showActivityBadge }) {
  return (
    <button
      className={`card ${isSelected ? "card-selected" : ""}`.trim()}
      onClick={onSelect}
      type="button"
    >

      <div className="card-content">
        <div className="card-header">
          <h2>{goal.title}</h2>
          {showActivityBadge ? (
            <span className={`activity-badge ${goal.activity === "inactive" ? "inactive" : "active"}`}>
              {goal.activity === "inactive" ? "Inactive" : "Active"}
            </span>
          ) : null}
        </div>

        <p>Priority: {goal.priority}</p>

        <p>Due: {goal.dueDate}</p>

      </div>

      <span>›</span>

    </button>
  );
}