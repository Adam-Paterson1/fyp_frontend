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
  return (
    <div className="Dists">
      {dists.raw.map((dist) => (
        <div className='dists'>{dist}</div>
        ))}
    </div>
  );
}

export default Dists;
