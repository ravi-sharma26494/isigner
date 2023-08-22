import React, { useEffect, useRef, useState } from "react";
import "./ResizableDraggableDiv.css";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const ResizableDraggableDiv = ({ signature }) => {
  // const [dragg, setDragg]= useState("Show Draggable");
  //tutus: https://www.youtube.com/watch?v=vDxZLN6FVqY
  const [showDrag, setShowDrag] = useState(false);
  const [{ x, y, width, height }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }));
  const containerRef = useRef(null);
  const dragEl = useRef(null);

  const bind = useDrag(
    (state) => {
      window.movement = state.movement;
      window.offset = state.offset;
      const isResizing = state?.event.target === dragEl.current;
      if (isResizing) {
        api.set({
          width: state.offset[0],
          height: state.offset[1],
        });
      } else {
        api.set({
          x: state.offset[0],
          y: state.offset[1],
        });
      }
    },
    {
      from: (event) => {
        const isResizing = event.target === dragEl.current;
        if (isResizing) {
          return [width.get(), height.get()];
        } else {
          return [x.get(), y.get()];
        }
      },
      bounds: (state) => {
        const isResizing = state?.event.target === dragEl.current;
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const containerHeight = containerRef.current?.clientHeight ?? 0;
        if (isResizing) {
          return {
            top: 50,
            left: 50,
            right: containerWidth - x.get(),
            bottom: containerHeight - y.get(),
          };
        } else {
          return {
            top: 0,
            left: 0,
            right: containerWidth - width.get(),
            bottom: containerHeight - height.get(),
          };
        }
      },
    }
  );
  const handleShowDragger = async (e) => {
    e.preventDefault();
    setShowDrag(true);
  };
  useEffect(() => {
    api.set({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, []);
  return (
    <>
      <div className="container" ref={containerRef}>
        {showDrag && (
          <div>
            <animated.div
              className="cropped-area"
              style={{ x, y, width, height,background:`url(${signature})`,backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat' }}
              {...bind()}
            >
              {/* <img
                src={signature}
                alt="Signature"
                style={{
                    zIndex:-1,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              /> */}
              <span className="resizer" ref={dragEl}></span>
            </animated.div>
          </div>
        )}
        <div className="overlay-controls">
          {/* <button onClick={handleSet}>{dragg}</button> */}
        </div>
      </div>
      <div className="button_container">
        <button className="button" onClick={handleShowDragger}>
          Show Dragger
        </button>
      </div>
    </>
  );
};

export default ResizableDraggableDiv;
