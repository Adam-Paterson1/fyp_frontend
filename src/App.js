import React, { useState } from 'react';
import './App.css';
import Socket from './Socket'
import Canvas from './Canvas'
import Dists from './Dists';
import Params from './Params';
import Attitude from './Attitude';

const defaultPid = {
  py: 1,
  iy: 0,
  dy: 0,
  pz: 1,
  iz: 0,
  dz: 0
}
const defaultTarget = {
  y: 0,
  z: 0
}
function App() {
  const [ip, setIP] = useState('192.168.137.176')
  function go (event) {
    if (event) {
      event.preventDefault()
    }
    Socket.boot(ip)
  }
  return (
    <div className="App">
      <header className="App-header">
       <Params setupState={defaultPid} name='pid' />
       <Params setupState={defaultTarget} name='target' />
        <div className="Params">
          <form onSubmit={go}>
            <label>
              IP <input id="ip" value={ip} onChange={(e) => setIP(e.target.value)} />
            </label>
          </form>
          <button id="start" onClick={go}>GO!</button>
          <button id="stop" onClick={Socket.stop}>STOP!</button>
        </div>
      </header>
      <main className="body">
        <Dists />
        <Canvas />
        <Attitude />
      </main>
    </div>
  );
}

export default App;
