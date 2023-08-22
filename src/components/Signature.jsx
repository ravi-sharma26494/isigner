import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function Signature() {
  const [file, setFile] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);

  let fileType = "application/pdf";

  const handleChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = (e) => {
          setFile(e.target.result);
        };
      } else {
        setFile(null);
      }
    } else {
      console.log("Select File");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file !== null) {
      setViewPdf(file);
    } else {
      setViewPdf(null);
    }
  };
  const newPlugin = defaultLayoutPlugin();
  return (
    <div className="container-sm">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          id="file"
          className="form-control"
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-success">
          View PDF
        </button>
      </form>
      <h2> View Pdf</h2>
      <div className="pdf-container">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          {viewPdf && 
            <div>
              <Viewer fileUrl={viewPdf} plugins={[newPlugin]}/>
            </div>
          } {
            !viewPdf && <>Choose a Pdf</>
          }
        </Worker>
      </div>
    </div>
  );
}

export default Signature;
