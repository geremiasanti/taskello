import React, { useState } from "react";

const styles = {
  form: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
  },
  input: {
    flex: 1,
    padding: "9px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "inherit",
  },
  inputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },
  button: {
    padding: "9px 16px",
    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    whiteSpace: "nowrap",
    transition: "opacity 150ms ease",
  },
};

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit({ body: body.trim() });
    setBody("");
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input
        style={{
          ...styles.input,
          ...(focused ? styles.inputFocus : {}),
        }}
        type="text"
        placeholder="Write a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
      />
      <button type="submit" style={styles.button}>
        Comment
      </button>
    </form>
  );
}
