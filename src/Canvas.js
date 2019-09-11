import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';

const HEIGHT = 400;
const WIDTH = 400;
const charSize = 10;
const drawOffset = (charSize - 1) / 2
function Canvas() {
  const [pose, setPose] = useState({fy: WIDTH / 2, fz: HEIGHT / 2, by: WIDTH / 2, bz: HEIGHT / 2, y: 0, z: 0})
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.fillRect(WIDTH / 2, 0, 1, HEIGHT)
    ctx.fillRect(0, HEIGHT / 2, WIDTH, 1)
    // ctx.fillRect(0, pose.x, WIDTH, 1)
    ctx.fillRect(pose.fy - drawOffset , pose.fz - drawOffset, charSize, charSize);
    // ctx.fillRect(pose.bx - drawOffset , pose.by - drawOffset, charSize, charSize);
  }, [canvasRef, pose])
  useEffect(() => {
    function setVLX (inc) {
      const totY = 1500
      const totX = 1500
      // const f = inc.front
      // const b = inc.back
      // setPose({ fy: 200 + (f.left - f.right) / totX * WIDTH,
      //           fz: 200 + (f.top - f.bot) / totY * HEIGHT,
      //           by: 200 + (b.left - b.right) / totX * WIDTH,
      //           bz: 200 + (b.top - b.bot) / totY * HEIGHT,
      //         })
      setPose({ fy: WIDTH / 2 + inc.y / totX * WIDTH,
        fz: HEIGHT / 2 + (-inc.z) / totY * HEIGHT,
        y: inc.y,
        z: inc.z
        // by: 200 + (b.left - b.right) / totX * WIDTH,
        // bz: 200 + (b.top - b.bot) / totY * HEIGHT,
      })
    }
    Socket.sub('pos', 'Canvas', setVLX)
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
       <div>{pose.y}</div>
       <div>{pose.z}</div>
    </div>
  );
}

export default Canvas;