import React, { useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import SignatureCanvas from 'react-signature-canvas';

function MySigV3() {
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
      const signaturePosition = { x: pageSize.width - 150, y: 100 }; // adjust the position of the signature here
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
          <div>
            <SignatureCanvas ref={signaturePad} />
            <button onClick={handleSignatureOk}>OK</button>
          </div>
          {signatureImage && (
            <div>
              <h2>Signature Preview:</h2>
              <img src={signatureImage} alt="Signature Preview" />
              <button onClick={handleSignPdf}>Sign</button>
            </div>
          )}
          {signedPdf && (
            <div>
              <h2>Signed PDF:</h2>
              <button onClick={handleDownloadPdf}>Download</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MySigV3;
