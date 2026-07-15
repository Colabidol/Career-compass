import compassLogo from "../assets/compass-svgrepo-com.svg";

const FILTER_OPTIONS = ["all", "active", "inactive"];

export default function Mainbar({
  isCompleteSelected,
  onCompleteToggle,
  selectedFilter,
  onFilterChange,
  onAddGoal,
}) {
  return (
    <div className="mainbar-panel">
      <div className="mainbar-brand">
        <img alt="Career Compass logo" className="mainbar-logo" src={compassLogo} />
        <h2>Career Compass</h2>
      </div>

      <input
        type="text"
        placeholder="Search..."
      />

      <button
        className="add-btn"
        onClick={onAddGoal}
        type="button"
      >
        + Add Goal
      </button>

      <h3>Status</h3>

      <button
        className={isCompleteSelected ? "btn-solid" : "btn-hollow"}
        onClick={onCompleteToggle}
        type="button"
      >
        Complete
      </button>

      <h3>Filter</h3>

      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          className={selectedFilter === option ? "btn-solid" : "btn-hollow"}
          onClick={() => onFilterChange(option)}
          type="button"
        >
          {option[0].toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}