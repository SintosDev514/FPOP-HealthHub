import { useEffect, useState } from "react";
import Cursorr from "./assets/cursor.png";

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    let animationFrame;

    const follow = () => {
      setTrail((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.12,
        y: prev.y + (pos.y - prev.y) * 0.12,
      }));
      animationFrame = requestAnimationFrame(follow);
    };

    follow();
    return () => cancelAnimationFrame(animationFrame);
  }, [pos]);

  return (
    <>
      {/*  <div
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          width: 20,
          height: 20,
          background: "black",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      />
*/}

      <img
        src={Cursorr} // put your image in public folder
        alt="cursor"
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          width: 30,
          height: 30,
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: trail.y,
          left: trail.x,
          width: 35,
          height: 35,
          border: "3px solid yellow",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      />
    </>
  );
}
