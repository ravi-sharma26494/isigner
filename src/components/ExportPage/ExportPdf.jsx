import React from 'react'
import html2canvas from 'html2canvas';
import"bootstrap/dist/css/bootstrap.css";
import {  jsPDF } from "jspdf";
const ExportPdf = ({id, customefilename, width, height}) => {
    const downloadFileDocument = ()=>{
        const input = document.getElementById(id);
        html2canvas(input).then((canvas)=>{
            const imgData = canvas.toDataURL("image/png");
            const pdf  = new jsPDF("p","pt",[width,height]);
            pdf.addImage(imgData, 'JPEG',0,0);
            pdf.save(`${customefilename}`)
        });
    };

  return (
    <div className='exports_pdf'>
        <button onClick={downloadFileDocument}>Sign The pdf please</button>
    </div>
  )
}

export default ExportPdf