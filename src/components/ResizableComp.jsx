
import React from 'react';
import { Resizable } from 'react-resizable';

// ...
class ResizableComp extends React.Component {
  state = {
    width: 200,
    height: 200,
  };

  // On top layout
  onResize = (event, {node, size, handle}) => {
    this.setState({width: size.width, height: size.height});
  };

  render() {
    return (
      <Resizable height={this.state.height} width={this.state.width} onResize={this.onResize}>
        <div className="box" style={{width: this.state.width + 'px', height: this.state.height + 'px', border:"1px solid red"}}>
          <span>Contents</span>
        </div>
      </Resizable>
    );
  }
}
export default ResizableComp;