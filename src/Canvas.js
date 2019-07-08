import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';

const HEIGHT = 400;
const WIDTH = 400;
const charSize = 10;
const drawOffset = (charSize - 1) / 2
function Canvas() {
  const [pose, setPose] = useState({x: WIDTH / 2, y: HEIGHT / 2})
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.fillRect(WIDTH / 2, 0, 1, HEIGHT)
    ctx.fillRect(0, HEIGHT / 2, WIDTH, 1)
    // ctx.fillRect(0, pose.x, WIDTH, 1)
    ctx.fillRect(pose.x - drawOffset , pose.y - drawOffset, charSize, charSize);
  }, [canvasRef, pose])
  useEffect(() => {
    function setPo (inc) {
      const tot = inc.x + inc.y
      setPose({ x: 200,
                y: 200 + (inc.y - inc.x) / tot * HEIGHT
              })
    }
    Socket.sub('pos', 'Canvas', setPo)
    // const interval = setInterval(randState, 20);
    // return () => clearInterval(interval)
    return function cleanup() {
      Socket.unsub('pos', 'Canvas')
    }
  
  }, [])
  
  return (
    <div className="canvasBlock">
      <canvas 
        id="myCanvas"
        ref={canvasRef}
        width="400"
        height="400"
        // style={{border:"1px solid #000000"}}
       />
    </div>
  );
}

export default Canvas;