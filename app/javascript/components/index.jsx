import React from "react";
import { createRoot } from "react-dom/client";
import HelloReact from "./HelloReact";

const components = {
  HelloReact,
};

document.addEventListener("DOMContentLoaded", () => {
  const mountPoint = document.getElementById("react-root");
  if (mountPoint) {
    const componentName = mountPoint.dataset.component || "HelloReact";
    const Component = components[componentName];
    if (Component) {
      const root = createRoot(mountPoint);
      root.render(<Component />);
    }
  }
});
