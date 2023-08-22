import React, { useEffect, useState } from "react";
// import "./styles.css";
import * as PDFJS from "pdfjs-dist/build/pdf";
import SignatureDragger from "../ResizableDiv/SignatureDragger";
import ExportPdf from "../ExportPage/ExportPdf";
import "bootstrap/dist/css/bootstrap.min.css";
import SignatureCanvasModal from "../SignatureCanvasModal/SignatureCanvasModal";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import base64ToArrayBuffer from "../../utils/helpers";

PDFJS.GlobalWorkerOptions.workerSrc =
  window.location.origin + "/pdf.worker.min.js";

export default function PdfViewer() {
  const [pdf, setPdf] = useState(null); // set the file to dispaly as images in the webpage
  const [pdfFile, setPdfFile] = useState(null); // // This is added because to embed the image to the pdf file, we actually need the blob of the pdf
  const [width, setWidth] = useState(0);
  const [images, setImages] = useState([]);
  const [height, setHeight] = useState(0);
  const [dragger, setDragger] = useState(false);
  const [showSignatureModel, setShowSignatureModel] = useState(false); // to show the signature canvas model
  const [signatureData, setSignatureData] = useState(null); // to get the drawn signature canvas image
  const [signatureDimenstions, setSignatureDimenstions] = useState({}); // to get the drawn signature's dimenstions
  const [signPdf, setSignPdf] = useState(false); // to show the sign pdf button after the signature have been drawn/captured

  async function showPdf(event) {
    try {
      const file = event.target.files[0];
      setPdfFile(file);
      const uri = URL.createObjectURL(file);
      // This is added because to embed the image to the pdf file, we actually need the blob of the pdf
      var _PDF_DOC = await PDFJS.getDocument(uri).promise;
      setPdf(_PDF_DOC);
      document.getElementById("file-to-upload").value = "";
    } catch (error) {
      alert(error.message);
      console.log("error", error);
    }
  }

  async function renderPage() {
    const imagesList = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");
    let canv = document.querySelector(".canv");

    for (let i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var viewport = page.getViewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      // console.log("Number of pages: ", pdf.numPages);
      setWidth(viewport.width);
      setHeight(viewport.height);
      await page.render(render_context).promise;
      let img = canvas.toDataURL("image/jpg");

      imagesList.push(img);
    }
    setImages(imagesList);
    setDragger(true);
    setShowSignatureModel(true);
  }


  // handle the signature data from the signature model
  const handleApplySignature = (data) => {
    setSignatureData(data);
    console.log(data);
    console.log("Got the signature data from the signature model");
    setSignPdf(true);
  };

  const handleAppliedSignatureDimensions = async (dimensions) => {
    const {height, position, width} = dimensions;
    setSignatureDimenstions(dimensions);
    // call the embed image function here now

  };

  const embedImageIntoPdf = async (pdfDoc, imageFile, newSigDimensions) => {
    console.log(newSigDimensions);
    const imageBytes = await base64ToArrayBuffer(imageFile);
    // const imageBytes = await imageFile.arrayBuffer();
    const image = await pdfDoc.embedPng(imageBytes);
    alert(newSigDimensions)
    const pages = pdfDoc.getPages();
    //const firstPage = pages[0];
    //const { width, height } = firstPage.getSize();
    // firstPage.drawImage(image, {
    //   x: newSigDimensions.position.x,
    //   y: height - newSigDimensions.position.y - newSigDimensions.height,
    //   width: newSigDimensions.width,
    //   height: newSigDimensions.height,
    // });
    
    // To render the signature on all the pages 
    for(let i=0; i<pages.length; i++) {
      const { width, height } = pages[i].getSize();
      pages[i].drawImage(image,{
        x: newSigDimensions.position.x,
        y: height - newSigDimensions.position.y - newSigDimensions.height,
        width: newSigDimensions.width,
        height: newSigDimensions.height,
      })
    }
    // firstPage.drawImage(image, {
    //   x: 0,
    //   y: 0,
    //   width: 50,
    //   height: 50,
    // });
     // Calculate the new width and height of the image to fit within the PDF
  // const imageWidth = Math.min(newSigDimensions.width, width);
  // const imageHeight = Math.min(newSigDimensions.height, height);

  // // Calculate the x and y position of the image within the PDF
  // const x = Math.min(newSigDimensions.position.x, width - imageWidth);
  // const y = Math.min(height - newSigDimensions.position.y - imageHeight, height - imageHeight);

  // // Draw the image onto the PDF
  // firstPage.drawImage(image, {
  //   x,
  //   y,
  //   width: imageWidth,
  //   height: imageHeight,
  // });
    return pdfDoc;
  };
  const handleSignPdf = async(e) => {
    e.preventDefault();
    try {
      const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
      const updatedPdfDoc = await embedImageIntoPdf(pdfDoc, signatureData,signatureDimenstions);
      const pdfBytes = await updatedPdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        window.location.href = url;

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (pdf) {
      renderPage();
    }
  }, [pdf]);

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "5px",
    },
    imageWrapper: {
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: "3px",
      boxShadow: "0 2px 5px 0 rgba(0,0,0,0.25)",
      padding: "0",
    },
  };

  return (
    <div
      className="container d-flex flex-column justify-content-center p-2"
      style={{ backgroundColor: "#EEEEEE" }}
    >
      <div className="input_controls d-flex justify-content-around my-5">
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById("file-to-upload").click()}
        >
          Select PDF
        </button>

        <input
          type="file"
          id="file-to-upload"
          accept="application/pdf"
          hidden
          onChange={showPdf}
        />

        <div className="signatureModel">
          {showSignatureModel && <SignatureCanvasModal onApplySignature={handleApplySignature} />}
        </div>
      </div>

      <div id="pdf-main-container">
        <div id="pdf-contents">
          <div id="image-convas-row">
            <div style={styles.wrapper} id="mysignature__dragger">
              {/* {images.map((image, idx) => (
                <div key={idx} style={styles.imageWrapper}>
                  {idx === 0 ? <SignatureDragger /> : null}
                  <img
                    src={image}
                    alt={`page-${idx}`}
                    width={width}
                    height={height}
                  />
                </div>
              ))} */}

              {/* <SignatureDragger /> */}
              {images.length > 0 && (
                <div>
                  <img
                    src={images[0]}
                    alt={`page-`}
                    width={width}
                    height={height}
                    id="testOne"
                    className="testOne"
                  />
                  <SignatureDragger bounds={".testOne"} signatureData={signatureData} onChangeDimensions={handleAppliedSignatureDimensions}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <ExportPdf id={"testOne"} customFileName={"somerandom"} width={width} height= {height}/> */}
      {signPdf &&
        <div className="d-grid gap-2 col-6 mx-auto my-5">
        <button className="btn btn-outline-success" type="button" onClick={handleSignPdf}>Sign Pdf</button>
  </div>
      }
      
    </div>
  );
}
