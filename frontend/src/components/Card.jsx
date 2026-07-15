export default function TaskCard({ goal, isSelected, onSelect }) {
  return (
    <button
      className={`card ${isSelected ? "card-selected" : ""}`.trim()}
      onClick={onSelect}
      type="button"
    >

      <div>

        <h2>{goal.title}</h2>

        <p>Priority: {goal.priority}</p>

        <p>Due: {goal.dueDate}</p>

      </div>

      <span>›</span>

    </button>
  );
}