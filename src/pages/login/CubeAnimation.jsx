import React, { useEffect } from "react";

const CubeAnimation = () => {
  useEffect(() => {
    const createCube = () => {
      const cube = document.createElement("div");
      cube.className = "cube";
      document.getElementById("cube-container").appendChild(cube);

      const size = Math.random() * 40 + 10;
      const position = Math.random() * 100;

      cube.style.width = `${size}px`;
      cube.style.height = `${size}px`;
      cube.style.left = `${position}%`;
      cube.style.animationDuration = `${Math.random() * 2 + 2}s`;
      cube.style.animationDelay = `${Math.random() * 1}s`;
      cube.addEventListener("animationend", () => {
        cube.remove();
      });
    };

    const interval = setInterval(createCube, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="cube-container"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    ></div>
  );
};

export default CubeAnimation;
