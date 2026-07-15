export default function TaskDetails() {
  return (
    <section className="details">

      <div className="top-buttons">
        <button>Edit</button>
        <button className="delete">Delete</button>
      </div>

      <h2>Apply to Accenture</h2>

      <label>Description</label>

      <textarea
        value="Lorem ipsum..."
        readOnly
      />

      <label>Category</label>

      <input value="Career" readOnly />

      <label>Priority</label>

      <input value="High" readOnly />

      <label>Due Date</label>

      <input value="Sept 26, 2026" readOnly />

      <button className="complete">
        Complete Goal
      </button>

    </section>
  );
}