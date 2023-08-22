import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signature from './components/Signature'
import DraggableSignaturePad from './components/DraggableSignaturePad'
import ResizableComp from './components/ResizableComp'
import MyComponent from './components/MySigV2'
import MySigV3 from './components/MySigV3'
import MySigV4 from './components/MySigV4'
// import DisplayOne from './components/DisplayOptions/DisplayOne'
import ResizableDraggableDiv from './components/ResizableDiv/ResizableDraggableDiv'
import MySignature from './components/ResizableDiv/MySignature'
import RenderPdf from './components/RenderPdf/RenderPdf'
import DragDropCopy from './components/DragDropCopy/DragDropCopy'
import SignatureCanvasModal from './components/SignatureCanvasModal/SignatureCanvasModal'





function App() {
  

  return (
    <>
    {/* <Signature />
    <DraggableSignaturePad /> */}
    {/* <MyComponent /> */}
    {/* <MySigV3 /> */}
    {/* <MySigV4 /> */}
    {/* <DisplayOne /> */}
    {/* <ResizableDraggableDiv /> */}
    {/* <MySignature /> */}
    {/* <DisplayPdf /> */}
    <RenderPdf />
    {/* <DragDropCopy /> */}
    {/* <SignatureCanvasModal /> */}
    </>
  )
}

export default App
