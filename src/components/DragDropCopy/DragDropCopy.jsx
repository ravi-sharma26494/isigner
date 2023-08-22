import React, { useState } from 'react';
import './DragDropCopy.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ShowModel = () => {
  return (
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">
              Save changes
            </button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DragDropCopy = () => {
  const [widgets, setWidgets] = useState([]);
  const [yoModal, setYoModal] = useState(false);

  function handleDrag(e, widgetType) {
    e.dataTransfer.setData('widgetType', widgetType);
  }

  function handleDrop(e) {
    const widgetType = e.dataTransfer.getData('widgetType');
    console.log('widgetType', widgetType);
    setWidgets([...widgets, widgetType]);
    e.dataTransfer.setData('widgetType', widgetType);
    setYoModal(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="div__main conatiner-fluid row">
      <div className="widgets col">
        <div
          className="widget"
          draggable
          onDragStart={(e) => handleDrag(e, 'Widget A')}
        >
          Widget A
        </div>

        <div
          className="widget"
          draggable
          onDragStart={(e) => handleDrag(e, 'Widget B')}
        >
          Widget B
        </div>

        <div
          className="widget"
          draggable
          onDragStart={(e) => handleDrag(e, 'Widget C')}
        >
          Widget C
        </div>
      </div>
      <div
        className="page col"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h1>Drag Elements here</h1>
        {widgets.map((widget, index) => (
          <div className="dropped-widget" key={index}>
            {widget}
          </div>
        ))}
      </div>
      {yoModal && <ShowModel />}
    </div>
  );
};

export default DragDropCopy;
