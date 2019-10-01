import React, { useState, useEffect } from 'react';
import Socket from './Socket';
import Paper from './Drawing';

function Graphs() {
  const [err, setErr] = useState({pz: 0, iz: 0, dz: 0, py: 0, iy: 0, dy: 0})
  useEffect(() => {
    Socket.sub('err', 'Signals', setErr)
    return function cleanup() {
      Socket.unsub('err', 'Signals')
    }
  }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      setErr({py: 0.2, iy: 0, dy: -0.2, pz: 0.5, iz: Math.round((Math.random()-0.5)*1000)/1000, dz: -0.4})
    }, 10);
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="graphBlock">
      <Paper name="y" p={err.py} i={err.iy} d={err.dy} />
      {/* <Paper name="z" p={err.pz} i={err.iz} d={err.dz} /> */}
    </div>
  );
}

export default Graphs;
