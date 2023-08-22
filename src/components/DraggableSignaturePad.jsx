import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { DraggableCore } from "react-draggable";

const DraggableSignaturePad = () => {
    const [showSignature, setShowSignature] = useState(false);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [shadowPosX, setShadowPosX] = useState(0);
    const [shadowPosY, setShadowPosY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef(null);
  
    const handleClear = () => {
      canvasRef.current.clear();
    };
  
    const handleSave = () => {
      setShowSignature(false);
      const signature = canvasRef.current.toDataURL();
      console.log(signature);
    };
  
    const handleDrag = (e, data) => {
      setIsDragging(true);
      setShadowPosX(data.x);
      setShadowPosY(data.y);
    };
  
    const handleStop = (e, data) => {
      setIsDragging(false);
      setPosX(data.x);
      setPosY(data.y);
      setShowSignature(true);
    };
  
    return (
      <>
      {/* show the shadow button as soon as the dragging starts */}
        {isDragging && (
          <div
            style={{
              border: "2px solid black",
              position: "absolute",
              left: shadowPosX,
              top: shadowPosY,
              zIndex: 998,
            }}
          >
            <button className="btn btn-success" type="button">
              SignatureA
            </button>
          </div>
        )}
        {/* if the dragging is stopped then show the signature pad div */}
        {!isDragging && showSignature && (
          <div
            style={{
              border: "2px solid black",
              position: "absolute",
              left: posX,
              top: posY,
              zIndex: 999,
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <button onClick={handleClear}>Clear</button>
              <button onClick={handleSave}>Save</button>
            </div>
            <SignatureCanvas ref={canvasRef} />
          </div>
        )}
        <DraggableCore onDrag={handleDrag} onStop={handleStop}>
          <div
            className="container-sm handle"
            style={{
              border: "2px solid black",
              position: "absolute",
              left: "100px",
              top: "100px",
            }}
          >
            <button className="btn btn-primary" type="button">
              Signature
            </button>
          </div>
        </DraggableCore>
      </>
    );
  };
  

export default DraggableSignaturePad;
