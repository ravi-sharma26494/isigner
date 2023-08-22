import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import SignaturePad from "react-signature-canvas";
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./SignatureCanvasModal.css";

const SignatureCanvasModal = ({ onApplySignature }) => {
  const [imageURL, setImageURL] = useState(null);
  const sigCanvas = useRef({});

  useEffect(() => {
    // Ensure that SignaturePad component is initialized before calling save function
    sigCanvas.current.on();
  }, []);

  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    const imageData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setImageURL(imageData);
    onApplySignature(imageData);
    //console.log(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-danger"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Draw a signature
      </button>

      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Draw Your signature on the canvas..
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body p-2">
              <SignaturePad
                ref={sigCanvas}
                penColor="red"
                canvasProps={{ className: "signatureCanvas", width:482, height:170}}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                
                onClick={clear}
              >
                Clear
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={save}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureCanvasModal;
