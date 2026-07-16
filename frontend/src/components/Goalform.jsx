import { useState } from "react";

export default function Goalform({
  onSubmitGoal,
  onCancel,
  isSubmitting,
  initialValues,
  submitLabel = "Save Goal",
  title = "Create Goal",
}) {
  const initialDueDateText = initialValues?.dueDate || "";
  const normalizedInitialDueDate =
    initialDueDateText.toLowerCase() === "no due date" ? "" : initialDueDateText;
  const [initialMonth = "", initialDay = "", initialYear = ""] =
    normalizedInitialDueDate.split("/") || [];

  const [formValues, setFormValues] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    priority: (initialValues?.priority || "medium").toLowerCase(),
    category: initialValues?.category || "Career",
    dueMonth: initialMonth,
    dueDay: initialDay,
    dueYear: initialYear,
  });
  const [dateError, setDateError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDatePartChange = (event) => {
    const { name, value } = event.target;
    const digitsOnly = value.replace(/\D/g, "");
    const maxLength = name === "dueYear" ? 4 : 2;
    const nextValues = {
      ...formValues,
      [name]: digitsOnly.slice(0, maxLength),
    };

    const getMaxDaysForMonth = (monthText, yearText) => {
      const monthNumber = Number.parseInt(monthText, 10);
      if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
        return 31;
      }

      const maxDaysByMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (monthNumber !== 2) {
        return maxDaysByMonth[monthNumber - 1];
      }

      if (yearText.length !== 4) {
        return 29;
      }

      const yearNumber = Number.parseInt(yearText, 10);
      const isLeapYear =
        (yearNumber % 4 === 0 && yearNumber % 100 !== 0) || yearNumber % 400 === 0;
      return isLeapYear ? 29 : 28;
    };

    if (nextValues.dueMonth) {
      const monthNumber = Number.parseInt(nextValues.dueMonth, 10);
      if (monthNumber > 12) {
        nextValues.dueMonth = "12";
      }
    }

    if (nextValues.dueDay) {
      const maxDays = getMaxDaysForMonth(nextValues.dueMonth, nextValues.dueYear);
      const dayNumber = Number.parseInt(nextValues.dueDay, 10);
      if (dayNumber > maxDays) {
        nextValues.dueDay = String(maxDays).padStart(2, "0");
      }
    }

    setDateError("");
    setFormValues(nextValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formValues.dueMonth && formValues.dueDay && formValues.dueYear) {
      const monthNumber = Number.parseInt(formValues.dueMonth, 10);
      const dayNumber = Number.parseInt(formValues.dueDay, 10);
      const yearNumber = Number.parseInt(formValues.dueYear, 10);
      const inputDate = new Date(yearNumber, monthNumber - 1, dayNumber);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        setDateError("Due date cannot be in the past.");
        return;
      }
    }

    const dueDate =
      formValues.dueMonth && formValues.dueDay && formValues.dueYear
        ? `${formValues.dueMonth}/${formValues.dueDay}/${formValues.dueYear}`
        : "";

    setDateError("");

    onSubmitGoal({
      ...formValues,
      dueDate,
    });
  };

  return (
    <form className="goalform-layout" onSubmit={handleSubmit}>
      <main className="foreground">
        <section className="goalform-panel">
          <h1>{title}</h1>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            maxLength={50}
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
            maxLength={300}
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
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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

          <label htmlFor="dueMonth">Due Date</label>
          <div className="goalform-date-fields">
            <input
              id="dueMonth"
              className="goalform-date-input"
              inputMode="numeric"
              maxLength={2}
              name="dueMonth"
              onChange={handleDatePartChange}
              pattern="[0-9]{1,2}"
              placeholder="MM"
              type="text"
              value={formValues.dueMonth}
            />
            <span className="goalform-date-separator">/</span>
            <input
              className="goalform-date-input"
              inputMode="numeric"
              maxLength={2}
              name="dueDay"
              onChange={handleDatePartChange}
              pattern="[0-9]{1,2}"
              placeholder="DD"
              type="text"
              value={formValues.dueDay}
            />
            <span className="goalform-date-separator">/</span>
            <input
              className="goalform-date-input goalform-date-input-year"
              inputMode="numeric"
              maxLength={4}
              name="dueYear"
              onChange={handleDatePartChange}
              pattern="[0-9]{4}"
              placeholder="YYYY"
              type="text"
              value={formValues.dueYear}
            />
          </div>
          {dateError ? <p className="goalform-date-error">{dateError}</p> : null}

          <div className="goalform-actions">
            <button className="goalform-cancel" onClick={onCancel} type="button">
              Cancel
            </button>
            <button className="goalform-save" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </section>
      </aside>
    </form>
  );
}
