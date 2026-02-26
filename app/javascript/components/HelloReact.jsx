import React, { useState } from "react";

export default function HelloReact() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px" }}>
      <h2>Hello from React!</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
