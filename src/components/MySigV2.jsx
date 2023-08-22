import { useState, useRef } from 'react';
import SignaturePad from 'signature_pad';
import { PDFDocument, rgb } from 'pdf-lib';

const MyComponent = () => {
  const [signatureData, setSignatureData] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  const handleSignatureOkClick = async () => {
    const canvas = canvasRef.current;
    const signaturePad = signaturePadRef.current;

    if (signaturePad.isEmpty()) {
      return;
    }

    const dataURL = signaturePad.toDataURL();
    setSignatureData(dataURL);

    const image = await fetch(dataURL).then((res) => res.blob());

    const pdfDoc = await PDFDocument.load(pdfData);
    const pages = pdfDoc.getPages();
    const { width, height } = pages[0].getSize();

    const signatureImage = await pdfDoc.embedPng(image);
    const signatureWidth = 100;
    const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth;

    const annotation = {
      x: 100,
      y: 100,
      width: signatureWidth,
      height: signatureHeight,
      image: signatureImage,
      transparency: 0.5,
      modify: async (newX, newY, newWidth, newHeight, newTransparency) => {
        annotation.x = newX;
        annotation.y = newY;
        annotation.width = newWidth;
        annotation.height = newHeight;
        annotation.transparency = newTransparency;

        const pages = pdfDoc.getPages();
        const { width, height } = pages[0].getSize();

        pages[0].drawImage(annotation.image, {
          x: annotation.x,
          y: height - (annotation.y + annotation.height),
          width: annotation.width,
          height: annotation.height,
          opacity: annotation.transparency,
        });

        setPdfData(await pdfDoc.save());
      },
    };

    pages[0].drawImage(signatureImage, {
      x: annotation.x,
      y: height - (annotation.y + annotation.height),
      width: annotation.width,
      height: annotation.height,
      opacity: annotation.transparency,
    });

    setPdfData(await pdfDoc.save());
  };

  const handlePdfFileChange = (event) => {
    const pdfFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const pdfData = reader.result;
      setPdfData(pdfData);
    };

    reader.readAsArrayBuffer(pdfFile);
  };

  const handleSaveClick = () => {
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signed.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={300}/>
      <button onClick={handleSignatureOkClick}>OK</button>
      <input type="file" onChange={handlePdfFileChange} />
      {pdfData && <button onClick={handleSaveClick}>Save</button>}
    </div>
  );
};

export default MyComponent;
