import compassLogo from "../assets/compass-svgrepo-com.svg";

const FILTER_OPTIONS = ["all", "active", "inactive"];

export default function Mainbar({
  isCompleteSelected,
  isGoalformOpen,
  onCompleteToggle,
  selectedFilter,
  onFilterChange,
  onAddGoal,
  searchTerm,
  onSearchChange,
}) {
  return (
    // Mainbar provides the primary task controls: search, create, status, and filters.
    <div className="mainbar-panel">
      <div className="mainbar-brand">
        <img alt="Career Compass logo" className="mainbar-logo" src={compassLogo} />
        <h2>Career Compass</h2>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
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
        className={!isGoalformOpen && isCompleteSelected ? "btn-solid" : "btn-hollow"}
        disabled={isGoalformOpen}
        onClick={onCompleteToggle}
        type="button"
      >
        Complete
      </button>

      <h3>Filter</h3>

      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          className={!isGoalformOpen && !isCompleteSelected && selectedFilter === option ? "btn-solid" : "btn-hollow"}
          disabled={isGoalformOpen || isCompleteSelected}
          onClick={() => onFilterChange(option)}
          type="button"
        >
          {option[0].toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}