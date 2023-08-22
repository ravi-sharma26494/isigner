import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import ResizableDraggableDiv from './ResizableDraggableDiv';


const MySignature = () => {
  const [showSignature, setShowSignature] = useState(false);
  const sigCanvas = useRef();

  const handleOpenSignature = () => {
    setShowSignature(true);
  };

  const handleSaveSignature = () => {
    const signature = sigCanvas.current.toDataURL();
    setShowSignature(false);
    sessionStorage.setItem('signature', signature);
  };

  return (
    <>
      {showSignature && (
        <div className="signature-canvas">
          <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 500, height: 200 }} />
          <button className="save-signature" onClick={handleSaveSignature}>OK</button>
        </div>
      )}
      <button className="open-signature" onClick={handleOpenSignature}>Open Signature Canvas</button>
      <ResizableDraggableDiv signature={sessionStorage.getItem('signature')} />
    </>
  );
};

export default MySignature;
