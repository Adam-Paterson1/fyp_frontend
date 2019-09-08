import React, { useState, useEffect } from 'react';
import './App.css';
import Socket from './Socket';


function Dists(props) {
  const [dists, setDists] = useState({
    raw: [0, 0, 0, 0, 0, 0, 0, 0],
    front: {top: 0, bot: 0, left: 0, right: 0},
    back: {top: 0, bot: 0, left: 0, right: 0}
  })

  useEffect(() => {
    Socket.sub('vlx', 'Dists', setDists)
    return function cleanup() {
      Socket.unsub('vlx', 'Dists')
    }
  }, [])
  const quality = {
    top: getColour(dists.front.top, dists.back.top),
    left: getColour(dists.front.left, dists.back.left),
    right: getColour(dists.front.right, dists.back.right),
    bot: getColour(dists.front.bot, dists.back.bot)
  }
  return (
    <div className="Dists">
      {Cube(dists.front, 'Front', quality)}
      {Cube(dists.back, 'Back', quality)}
    </div>
  );
}
function getColour(prop1, prop2) {
  const diff = (Math.abs(prop1 - prop2) / 50) || 0 
  const r = diff * 255
  const g = (1 - diff) * 255
  return 'rgb(' + r + ',' + g + ',0)'
}

function Cube (dataSet, displayName, quality) {
  return (
  <div className="container">
    <div>{displayName}</div>
    <div className="top" style={{backgroundColor: quality.top}}>
      {dataSet.top}
    </div>
    <div className="left" style={{backgroundColor: quality.left}}>
      {dataSet.left}
    </div>
    <div className="right" style={{backgroundColor: quality.right}}>
      {dataSet.right}
    </div>
    <div className="bot" style={{backgroundColor: quality.bot}}>
      {dataSet.bot}
    </div>
  </div>)
}
export default Dists;


