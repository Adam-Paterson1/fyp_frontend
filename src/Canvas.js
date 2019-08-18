import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';

const HEIGHT = 400;
const WIDTH = 400;
const charSize = 10;
const drawOffset = (charSize - 1) / 2
function Canvas() {
  const [pose, setPose] = useState({fx: WIDTH / 2, fy: HEIGHT / 2, bx: WIDTH / 2, by: HEIGHT / 2})
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.fillRect(WIDTH / 2, 0, 1, HEIGHT)
    ctx.fillRect(0, HEIGHT / 2, WIDTH, 1)
    // ctx.fillRect(0, pose.x, WIDTH, 1)
    ctx.fillRect(pose.fx - drawOffset , pose.fy - drawOffset, charSize, charSize);
    ctx.fillRect(pose.bx - drawOffset , pose.by - drawOffset, charSize, charSize);
  }, [canvasRef, pose])
  useEffect(() => {
    function setVLX (inc) {
      const totY = 1000
      const totX = 1000
      const f = inc.front
      const b = inc.back
      setPose({ fx: 200 + (f.left - f.right) / totX * WIDTH,
                fy: 200 + (f.top - f.bot) / totY * HEIGHT,
                bx: 200 + (b.left - b.right) / totX * WIDTH,
                by: 200 + (b.top - b.bot) / totY * HEIGHT,
              })
    }
    Socket.sub('vlx', 'Canvas', setVLX)
    // const interval = setInterval(randState, 20);
    // return () => clearInterval(interval)
    return function cleanup() {
      Socket.unsub('vlx', 'Canvas')
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