// import { useState } from 'react';
// import { PDFDocument, PDFPageDrawCircleOptions } from 'pdf-lib';

// const DisplayOne = () => {
//   const [pdfData, setPdfData] = useState(null);

//   const handlePdfFileChange = async (event) => {
//     const pdfFile = event.target.files[0];
//     const reader = new FileReader();

//     await new Promise((resolve, reject) => {
//       reader.onload = () => resolve();
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(pdfFile);
//     });

//     const pdfData = reader.result;
//     setPdfData(pdfData);

//     // Get the canvas element
//     const canvas = document.getElementById('pdf-canvas');

//     // Load the PDF document
//     const pdfDoc = await PDFDocument.load(pdfData);

//     // Get the first page of the document
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];

//     // Get the page dimensions
//     const { width, height } = firstPage.getSize();

//     // Get the canvas context
//     const ctx = canvas.getContext('2d');

//     // Set the canvas dimensions to match the page dimensions
//     canvas.width = width;
//     canvas.height = height;

//     // Render the PDF page on the canvas
//     await firstPage.render({
//       canvasContext: ctx,
//       viewport: firstPage.getViewport({ scale: 1 })
//     }).promise;
//   };

//   return (
//     <div>
//       <input type="file" onChange={handlePdfFileChange} />
//       <div className='container'>
//         {pdfData && (
//           <canvas id="pdf-canvas" />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DisplayOne;
