import React, { useState } from 'react';
import './App.css';
import Socket from './Socket'
import Canvas from './Canvas'
import Dists from './Dists';

function App() {
  const [ip, setIP] = useState('')
  function go () {
    Socket.boot(ip)
  }
  return (
    <div className="App">
      <header className="App-header">
        <Dists />
        <input value={ip} onChange={(e) => setIP(e.target.value)} />
        <button onClick={go}>GO!</button>
        <button onClick={Socket.stop}>STOP!</button>

      </header>
      <Canvas />

    </div>
  );
}

export default App;
