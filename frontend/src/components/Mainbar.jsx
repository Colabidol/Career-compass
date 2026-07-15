export default function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>Career Compass</h2>

      <input
        type="text"
        placeholder="Search..."
      />

      <button className="add-btn">
        + Add Goal
      </button>

      <h3>Status</h3>

      <button>Complete</button>

      <h3>Filter</h3>

      <button>All</button>
      <button>Active</button>
      <button>Inactive</button>

    </aside>
  );
}