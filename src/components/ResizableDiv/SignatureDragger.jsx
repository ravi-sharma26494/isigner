import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import reactLogo from "../../assets/react.svg";
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px dashed red",
  background: "transparent",
};
const imageStyle = {
  boxShadow: "none",
  userSelect: "none",
  maxWidth:"100%",
  maxHeight:"100%",
  width:"auto",
  height:"auto",
};

const SignatureDragger = ({ bounds, signatureData,onChangeDimensions }) => {
  const [parentDimensions, setParentDimensions] = useState({
    width: 500,
    height: 500,
  });
  const [draggableAreaOffset, setDraggableAreaOffset] = useState(10);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [signatureSize, setSignatureSize] = useState({ width: 50, height: 50 });
  
  const handleSignatureChange = async (newPosition, newWidth, newHeight) => {
    setSignaturePosition(newPosition);
    setSignatureSize({ width: newWidth, height: newHeight });
    console.log("Signature position:", newPosition);
    console.log("Signature size:", { width: newWidth, height: newHeight });

    // A callback function which is passing the data(signature position and the width) back to the parent RenderPdf
    const newObj = {
      position : newPosition,
      width : newWidth,
      height : newHeight
    }
    onChangeDimensions(newObj);
  };
  
  useEffect(() => {
    const parent = document.querySelector(bounds);
    const { width, height } = parent.getBoundingClientRect();
    const offset = Math.min(width, height) * 0.02;
    setParentDimensions({ width, height });
    setDraggableAreaOffset(offset);
  }, []);

  return (
    <Rnd
      style={style}
      default={{
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      }}
      bounds={bounds}
      enableResizing={true}
      dragGrid={[draggableAreaOffset, draggableAreaOffset]}
      onDragStop={(e, d) =>
        handleSignatureChange(
          { x: d.x, y: d.y },
          signatureSize.width,
          signatureSize.height
        )
      }
      onResizeStop={(e, direction, ref, delta, position) =>
        handleSignatureChange(position, ref.offsetWidth, ref.offsetHeight)
      }
      minWidth={50}
      minHeight={50}
      maxWidth={200}
      maxHeight={150}
    >
      <img src={signatureData} alt="signature" style={imageStyle} draggable="false"/>
      {/* <h3>Drag me</h3> */}
    </Rnd>
  );
};
export default SignatureDragger;
