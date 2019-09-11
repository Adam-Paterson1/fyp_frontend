import React, { useState, useEffect } from 'react';
import './App.css';
import Socket from './Socket';


function Attitude(props) {
  const [Attitude, setAttitude] = useState({
    y: 0,
    z: 0,
    curr: {
      thrust: 0,
      roll: 0,
      pitch: 0,
      yaw: 0
    }, 
    target: {
      thrust: 0,
      roll: 0,
      pitch: 0,
      yaw_rate: 0
    }
  })

  useEffect(() => {
    Socket.sub('attitude', 'Attitude', setAttitude)
    return function cleanup() {
      Socket.unsub('attitude', 'Attitude')
    }
  }, [])
  const quality = {
    top: getColour(Attitude.target.thrust, Attitude.curr.thrust),
    left: getColour(Attitude.target.roll, Attitude.curr.roll),
    right: getColour(Attitude.target.pitch, Attitude.curr.pitch),
    bot: getColour(Attitude.target.yaw_rate, 0)
  }
  return (
    <div className="Attitude">
      <div>{Attitude.y}</div>
      <div>{Attitude.z}</div>
      {Cube(Attitude.curr, 'Current', quality)}
      {Cube(Attitude.target, 'Target', quality)}
    </div>
  );
}
function getColour(prop1, prop2) {
  if (prop1 > prop2) {
    return 'rgb(0,255,0)'
  } else if (prop1 === prop2) {
    return 'rgb(255,255,255)'
  } else {
    return 'rgb(255,0,0)'
  }
}

function Cube (dataSet, displayName, quality) {
  return (
  <div className="container">
    <div>{displayName}</div>
    <div className="top" style={{backgroundColor: quality.top}}>
      {dataSet.thrust}
    </div>
    <div className="left" style={{backgroundColor: quality.left}}>
      {dataSet.roll}
    </div>
    <div className="right" style={{backgroundColor: quality.right}}>
      {dataSet.pitch}
    </div>
    <div className="bot" style={{backgroundColor: quality.bot}}>
      {dataSet.yaw || dataSet.yaw_rate}
    </div>
  </div>)
}
export default Attitude;


