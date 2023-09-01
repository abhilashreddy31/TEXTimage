import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import './home.css'


const Text = ({ text, index, onChangeText }) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 150, height: 100 });
  
    const handleDrag = (e, ui) => {
      setPosition({ x: ui.x, y: ui.y });
    };
  
    const handleResize = (e, data) => {
      setSize({ width: data.size.width, height: data.size.height });
    };
  
    return (
      <Draggable handle=".handle" defaultPosition={{ x: position.x, y: position.y }} onDrag={handleDrag} draggableChildren={true}>

        <ResizableBox  width={size.width} height={size.height}
          onResize={handleResize}
          minConstraints={[100, 50]}>
          <div className="handle">
            <input className='text-input'  type="text" value={text}
              onChange={(e) => onChangeText(index, e.target.value)}
              
            />
          </div>
        </ResizableBox>
      </Draggable>
    );
  };
  
  export default Text;
