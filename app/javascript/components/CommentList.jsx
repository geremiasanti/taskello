import React from "react";
import CommentItem from "./CommentItem";

const styles = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  empty: {
    fontSize: "13px",
    color: "#cbd5e1",
    padding: "12px 0",
    textAlign: "center",
  },
};

export default function CommentList({ comments, onDelete }) {
  if (comments.length === 0) {
    return <div style={styles.empty}>No comments yet</div>;
  }

  return (
    <div style={styles.list}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onDelete={onDelete} />
      ))}
    </div>
  );
}
