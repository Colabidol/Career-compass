import { useState } from "react";

export default function Goalform({ onSubmitGoal, onCancel, isSubmitting }) {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "Career",
    dueDate: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitGoal(formValues);
  };

  return (
    <form className="goalform-layout" onSubmit={handleSubmit}>
      <main className="foreground">
        <section className="goalform-panel">
          <h1>Create Goal</h1>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            onChange={handleInputChange}
            placeholder="Enter goal title"
            required
            type="text"
            value={formValues.title}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={handleInputChange}
            placeholder="Describe your goal"
            rows={10}
            value={formValues.description}
          />
        </section>
      </main>

      <aside className="sidebar">
        <section className="goalform-panel goalform-panel-side">
          <h2>Goal Details</h2>

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            onChange={handleInputChange}
            value={formValues.priority}
          >
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            onChange={handleInputChange}
            value={formValues.category}
          >
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>

          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            onChange={handleInputChange}
            pattern="(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}"
            placeholder="MM/DD/YYYY"
            type="text"
            value={formValues.dueDate}
          />

          <div className="goalform-actions">
            <button className="goalform-cancel" onClick={onCancel} type="button">
              Cancel
            </button>
            <button className="goalform-save" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save Goal"}
            </button>
          </div>
        </section>
      </aside>
    </form>
  );
}
