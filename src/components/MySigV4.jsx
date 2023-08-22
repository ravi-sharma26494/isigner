import React, { useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import SignatureCanvas from 'react-signature-canvas';

function MySigV4() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signedPdf, setSignedPdf] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const signaturePad = useRef(null);

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    setPdfUrl(URL.createObjectURL(e.target.files[0]));
  };

  // get the text from the canvas and set it to the state object
  const handleSignatureOk = () => {
    const image = signaturePad.current.toDataURL();
    setSignatureImage(image);
  };

  // place the signature
  const handleSignPdf = async () => {
    const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
    const pages = pdfDoc.getPages();
    const firstPage = pages[selectedPage - 1];
    const { width, height } = firstPage.getSize();
    const signatureImageBytes = await fetch(signaturePad.current.toDataURL()).then((res) => res.arrayBuffer());
    const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
    const pageSize = { width, height };
    const signaturePosition = { x: pageSize.width - 20, y: 10 }; // adjust the position of the signature here
    firstPage.drawImage(signatureImageEmbed, {
      x: signaturePosition.x,
      y: pageSize.height - signaturePosition.y - signatureImageEmbed.height, // invert the y-axis to match PDF coordinate system
      width: signatureImageEmbed.width,
      height: signatureImageEmbed.height,
    });
    const signedPdfBytes = await pdfDoc.save();
    setSignedPdf(new Blob([signedPdfBytes], { type: 'application/pdf' }));
  };
  

  const handleDownloadPdf = () => {
    const downloadLink = URL.createObjectURL(signedPdf);
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = 'signed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePageSelect = (e) => {
    setSelectedPage(parseInt(e.target.value));
  };

  const handlePdfPreview = async () => {
    const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
    const pages = pdfDoc.getPages();
    setPdfPages(pages);
  };

  return (
    <div>
      <div>
        <input type="file" onChange={handlePdfChange} />
      </div>
      {pdfFile && (
        <div>
          <h2>Selected PDF File:</h2>
          <p>{pdfFile.name}</p>
          <button onClick={handlePdfPreview}>Preview PDF</button>
          {pdfPages.length > 0 && (
            <div>
              <label htmlFor="page-select">Select Page:</label>
              <select id="page-select" value={selectedPage} onChange={handlePageSelect}>
                {pdfPages.map((page, index) => (
                  <option key={index} value={index + 1}>
                    Page {index + 1}
                  </option>
                ))}
              </select>
              <div style={{ border: '1px solid black', maxWidth: 500, margin: 'auto' }}>
                <SignatureCanvas ref={signaturePad} penColor='black' canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
              </div>
              <button onClick={handleSignatureOk}>Save Signature</button>
              {signatureImage && (
                <div>
                  <h2>Signature Preview:</h2>
                  <img src={signatureImage} alt="signature" style={{ maxWidth: 200 }} />
                  <button onClick={handleSignPdf}>Sign PDF</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {signedPdf && (
        <div>
          <h2>Signed PDF:</h2>
          <button onClick={handleDownloadPdf}>Download PDF</button>
          <iframe title="Signed PDF" src={URL.createObjectURL(signedPdf)} width="100%" height="500px"></iframe>
        </div>
        
      )}
    </div>
  );
}
export default MySigV4;
               
