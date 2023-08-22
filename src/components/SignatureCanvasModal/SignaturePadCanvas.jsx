import React, { useState, useRef } from "react";
import SignaturePad from "react-signature-canvas";

function SignaturePadCanvas() {
  const [imageURL, setImageURL] = useState(null);
  const sigCanvas = useRef({});
  const clear = () => sigCanvas.current.clear();

  const save = () =>
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));

  return (
    <div className="my_sig_canvas">
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          className: "signatureCanvas"
        }}
      />
      {/* Button to trigger save canvas image */}
      <button onClick={save}>Save</button>
      <button onClick={clear}>Clear</button>
      <br />
      <br />
      {imageURL ? (
        <img
          src={imageURL}
          alt="my signature"
          style={{
            display: "block",
            margin: "0 auto",
            border: "1px solid black",
            width: "150px"
          }}
        />
      ) : null}
    </div>
  );
}

export default SignaturePadCanvas;
