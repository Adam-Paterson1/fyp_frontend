import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';
import paper, {Path, Point} from 'paper';
import { toDP } from './Utils'
// What zooms and shrinks???
// First thing - Position estimate from drone,
// If it says it is 5 to the right of 1000 width
// Then we scale it up to be 7.5 of 1500
// When I define a path I want the trajectory to follow
// the shape, not the absolute values
// So if the tunnel is smaller than I expect, my commands 
// should be shrunk too
let totY = 1500
let totZ = 1500
const HEIGHT = 350;
const WIDTH = 350;
const charSize = 10;
const drawOffset = (charSize - 1) / 2
const MEM_LENGTH = 20
const MAX_JUMP = 50
const colorStep = 250 / MEM_LENGTH
const initialArray = new Array(MEM_LENGTH).fill({fy: WIDTH / 2, fz: HEIGHT / 2, by: WIDTH / 2, bz: HEIGHT / 2, y: 0, z: 0})
let ourPath = []
let pathing = false
let trackingPath = null
function setPathing (serverPathing) {
  pathing = serverPathing
  if (pathing) {
    if (!trackingPath) {
      trackingPath = new Path()
      trackingPath.strokeColor = 'black'
    } else {
      trackingPath.removeSegments()
    }  
  }
}
function Canvas() {
  const [pose, setPose] = useState(initialArray)
  const [kfPose, setKFPose] = useState(initialArray)

  const [target, setTarget] = useState({y: WIDTH / 2 , z : HEIGHT / 2})
  const canvasRef = useRef(null)
  const canvasTargetRef = useRef(null)
  const canvasCrosshairsRef = useRef(null)

  useEffect(() => {
    const canvas = canvasCrosshairsRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.fillRect(WIDTH / 2, 0, 1, HEIGHT)
    ctx.fillRect(0, HEIGHT / 2, WIDTH, 1)
  }, [canvasCrosshairsRef])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    pose.forEach((pose, i) => {
      ctx.fillStyle= 'rgb(' + Math.floor(250 - colorStep * i) + ', ' +
      Math.floor(250 - colorStep * i) + ',' + Math.floor(250 - colorStep * i) + ')'
      ctx.fillRect(pose.fy - drawOffset , pose.fz - drawOffset, charSize, charSize);
    })
    kfPose.forEach((pose, i) => {
      ctx.fillStyle= 'rgb(255,' +
      Math.floor(250 - colorStep * i) + ',' + Math.floor(250 - colorStep * i) + ')'
      ctx.fillRect(pose.fy - (drawOffset-2) , pose.fz - (drawOffset-2), charSize-4, charSize-4);
    })

  }, [canvasRef, pose, kfPose])

  useEffect(() => {
    const canvas = canvasTargetRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle='#00ff00'
    ctx.fillRect(target.y - (drawOffset-1) , target.z - (drawOffset-1), charSize-2, charSize-2);
  }, [canvasTargetRef, target])

  useEffect(() => {
    function setVLX (inc) {
      totY = toDP(inc.width, 0)
      totZ = toDP(inc.height, 0)
      const newPose = {
        fy: Math.round(WIDTH / 2 + inc.y / totY * WIDTH),
        fz: Math.round(HEIGHT / 2 + (-inc.z) / totZ * HEIGHT),
        y: toDP(inc.y, 0),
        z: toDP(inc.z, 0)
      }
      setPose((curr) => [...curr, newPose].slice(-MEM_LENGTH))
    }
    function setTargetCanvas (inc) {
      const newTarget = {
        y: Math.round(WIDTH / 2 + inc.y * WIDTH),
        z: Math.round(HEIGHT / 2 + (-inc.z) * HEIGHT)
      }
      setTarget(newTarget)
    }
    function setKF (inc) {
      const newPose = {
        fy: Math.round(WIDTH / 2 + inc.y / totY * WIDTH),
        fz: Math.round(HEIGHT / 2 + (-inc.z) / totZ * HEIGHT),
        y: toDP(inc.y, 0),
        z: toDP(inc.z, 0)
      }
      if (pathing && trackingPath) {
        trackingPath.add(new Point(newPose.fy, newPose.fz))
      }

      setKFPose((curr) => [...curr, newPose].slice(-MEM_LENGTH))
    }
    Socket.sub('pos', 'Canvas', setVLX)
    Socket.sub('target', 'Canvas', setTargetCanvas)
    Socket.sub('attitude', 'Canvas', setKF)
    Socket.sub('pathing', 'Canvas', setPathing)
    // function randState () {
    //   setVLX({y: Math.random()* 500, z: Math.random()* 500})
    // }
    // const interval = setInterval(randState, 20);
    // return () => clearInterval(interval)
    return function cleanup() {
      Socket.unsub('pos', 'Canvas')
      Socket.unsub('target', 'Canvas')
      Socket.unsub('attitude', 'Canvas')
      Socket.unsub('pathing', 'Canvas')
    }
  }, [])

  const paperRef = useRef(null)
  useEffect(() => {
    paper.setup(paperRef.current)
    var tool = new paper.Tool();
    var path = new Path();
    tool.onMouseDown = function(event) {
      path.removeSegments()
      ourPath = [];
      path.strokeColor = 'black';
      path.add(event.point);
    }
    tool.onMouseDrag = function(event) {
      path.add(event.point);
    }
    tool.onKeyDown = function (event) {
      if (event.key === 'space')
        paper.project.activeLayer.selected = !paper.project.activeLayer.selected;
    }
    tool.onMouseUp = function (event) {  
      // When the mouse is released, simplify it:
      path.simplify(0.4)
      path.flatten(2)
      if (path.segments.length > 1) {
        let prevSeg = {
          y: toDP((path.firstSegment.point.x - paper.view.center.x) / WIDTH, 4),
          z: toDP((paper.view.center.y - path.firstSegment.point.y) / HEIGHT, 4)
        }
        for (let i = 0; i < path.segments.length; i++) {
          const seg = path.segments[i]
          const nextY = toDP((seg.point.x - paper.view.center.x) / WIDTH, 4)
          const nextZ = toDP((paper.view.center.y - seg.point.y) / HEIGHT, 4)
          let dY = (nextY - prevSeg.y) * 1500
          let dZ = (nextZ - prevSeg.z) * 1500
          let dist = Math.sqrt( dY * dY + dZ * dZ)
          // Max 5 cm between target points for smoothish path
          while (dist > MAX_JUMP) {
            // Update previous segment to what we are about to insert
            let numDivisions = Math.round(1 + (dist / MAX_JUMP))
            prevSeg.y = toDP(prevSeg.y + dY / (numDivisions * 1500), 4)
            prevSeg.z = toDP(prevSeg.z + dZ / (numDivisions * 1500), 4)
            dY = (nextY - prevSeg.y) * 1500
            dZ = (nextZ - prevSeg.z) * 1500
            dist = Math.sqrt( dY * dY + dZ * dZ)
            ourPath.push({
              y: prevSeg.y,
              z: prevSeg.z
            })
            const point = {
              x: (prevSeg.y * WIDTH ) + paper.view.center.x,
              y: -((prevSeg.z * HEIGHT) - paper.view.center.y)
            }
            path.insert(i, point)
            i = i + 1
          }
          ourPath.push({
            y: nextY,
            z: nextZ
          })
          prevSeg.y = nextY
          prevSeg.z = nextZ
  
        }
        path.firstSegment.selected = true

      }
    }
  }, [])
  const handleStart = (event) => {
    if (event) {
      event.preventDefault()
    }
    Socket.send({type: 'path', payload: ourPath})
  }
  const handleStop = (event) => {
    if (event) {
      event.preventDefault()
    }
    Socket.send({type: 'path', payload: []})
  }
  
  return (
    <div className="canvasBlock">
      <div>Position</div>
      <button className="start" onClick={handleStart}>Start</button>
        <button className="stop" onClick={handleStop}>Stop</button>
      <div className="canvasBlock">
      <div className="position">
        <div>Y: {pose[pose.length-1].y}</div>
        <div>Z: {pose[pose.length-1].z}</div>
      </div>
      <div className="position">
        <div>Width: {totY}</div>
        <div>Height: {totZ}</div>
      </div>
      </div>
      <canvas
        id="crossHairs"
        ref={canvasCrosshairsRef}
        width={WIDTH}
        height={HEIGHT}
        // style={{border:"1px solid #000000"}}
      />
      <canvas 
        id="posCanvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        // style={{border:"1px solid #000000"}}
       />
      <canvas 
        id="targetCanvas"
        ref={canvasTargetRef}
        width={WIDTH}
        height={HEIGHT}
        // style={{border:"1px solid #000000"}}
       />
      <canvas 
        id="drawCanvas"
        ref={paperRef}
        width={WIDTH}
        height={HEIGHT}
        // style={{border:"1px solid #000000"}}
       />

    </div>
  );
}

export default Canvas;