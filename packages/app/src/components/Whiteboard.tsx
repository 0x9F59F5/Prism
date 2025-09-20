import React, { useState } from 'react';
import { Shape, RectangleShape, CircleShape } from '@prism/core';

type ShapeType = 'rectangle' | 'circle';

const Whiteboard = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState<Shape | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    if (selectedShapeId) {
      setSelectedShapeId(null);
      return;
    }
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    const id = `shape-${Date.now()}`;
    if (shapeType === 'rectangle') {
      setNewShape({
        id,
        type: 'rectangle',
        x: offsetX,
        y: offsetY,
        width: 0,
        height: 0,
      });
    } else if (shapeType === 'circle') {
      setNewShape({
        id,
        type: 'circle',
        cx: offsetX,
        cy: offsetY,
        r: 0,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (isDrawing && newShape) {
      if (newShape.type === 'rectangle') {
        setNewShape({
          ...newShape,
          width: offsetX - newShape.x,
          height: offsetY - newShape.y,
        });
      } else if (newShape.type === 'circle') {
        const r = Math.sqrt(
          Math.pow(offsetX - newShape.cx, 2) +
            Math.pow(offsetY - newShape.cy, 2)
        );
        setNewShape({ ...newShape, r });
      }
    } else if (selectedShapeId && dragStart) {
      const dx = offsetX - dragStart.x;
      const dy = offsetY - dragStart.y;
      setShapes(
        shapes.map((shape) => {
          if (shape.id !== selectedShapeId) return shape;
          if (shape.type === 'rectangle') {
            return { ...shape, x: shape.x + dx, y: shape.y + dy };
          } else if (shape.type === 'circle') {
            return { ...shape, cx: shape.cx + dx, cy: shape.cy + dy };
          }
          return shape;
        })
      );
      setDragStart({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = () => {
    if (newShape) {
      setShapes([...shapes, newShape]);
    }
    setIsDrawing(false);
    setNewShape(null);
    setSelectedShapeId(null);
    setDragStart(null);
  };

  const handleShapeMouseDown = (
    event: React.MouseEvent<SVGRectElement | SVGCircleElement>,
    shapeId: string
  ) => {
    event.stopPropagation();
    setSelectedShapeId(shapeId);
    const { clientX, clientY } = event;
    setDragStart({ x: clientX, y: clientY });
  };

  const renderShape = (shape: Shape) => {
    const isSelected = shape.id === selectedShapeId;
    switch (shape.type) {
      case 'rectangle':
        return (
          <rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={isSelected ? 'lightgreen' : 'lightblue'}
            stroke="blue"
            strokeWidth="2"
            onMouseDown={(e) => handleShapeMouseDown(e, shape.id)}
          />
        );
      case 'circle':
        return (
          <circle
            key={shape.id}
            cx={shape.cx}
            cy={shape.cy}
            r={shape.r}
            fill={isSelected ? 'lightgreen' : 'lightblue'}
            stroke="blue"
            strokeWidth="2"
            onMouseDown={(e) => handleShapeMouseDown(e, shape.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setShapeType('rectangle')}>Rectangle</button>
        <button onClick={() => setShapeType('circle')}>Circle</button>
      </div>
      <svg
        width="800"
        height="600"
        style={{ border: '1px solid black' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {shapes.map(renderShape)}
        {newShape && renderShape(newShape)}
      </svg>
    </div>
  );
};

export default Whiteboard;
