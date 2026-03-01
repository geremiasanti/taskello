import React, { useState, useEffect } from "react";

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "inherit",
  },
  inputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
    minHeight: "70px",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "inherit",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  submit: {
    padding: "8px 18px",
    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    transition: "opacity 150ms ease",
  },
  cancel: {
    padding: "8px 18px",
    background: "#fff",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "background 150ms ease",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "inherit",
    flex: 1,
    background: "#fff",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "-4px",
  },
};

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority || "low");
      setDueDate(task.due_date || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
    }
  }, [task]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || null,
    });
    if (!task) {
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <input
        style={{
          ...styles.input,
          ...(focusedField === "title" ? styles.inputFocus : {}),
        }}
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setFocusedField("title")}
        onBlur={() => setFocusedField(null)}
        required
      />
      <textarea
        style={{
          ...styles.textarea,
          ...(focusedField === "desc" ? styles.inputFocus : {}),
        }}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onFocus={() => setFocusedField("desc")}
        onBlur={() => setFocusedField(null)}
      />
      <div style={styles.row}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={styles.label}>Priority</span>
          <select
            style={{
              ...styles.select,
              ...(focusedField === "priority" ? styles.inputFocus : {}),
            }}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            onFocus={() => setFocusedField("priority")}
            onBlur={() => setFocusedField(null)}
          >
            <option value="low">Low</option>
            <option value="low">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={styles.label}>Due date</span>
          <input
            style={{
              ...styles.input,
              ...(focusedField === "due" ? styles.inputFocus : {}),
            }}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onFocus={() => setFocusedField("due")}
            onBlur={() => setFocusedField(null)}
          />
        </div>
      </div>
      <div style={styles.actions}>
        <button type="submit" style={styles.submit}>
          {task ? "Save changes" : "Add Task"}
        </button>
        {onCancel && (
          <button type="button" style={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
