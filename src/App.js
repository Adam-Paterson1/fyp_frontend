import React, { useState } from 'react';
import './App.css';
import Socket from './Socket'
import Canvas from './Canvas'

function App() {
  const [ip, setIP] = useState('')
  function go () {
    Socket.boot(ip)
  }
  return (
    <div className="App">
      <header className="App-header">
        <input value={ip} onChange={(e) => setIP(e.target.value)} />
        <button onClick={go}>GO!</button>
        <button onClick={Socket.stop}>STOP!</button>

        <Canvas />
      </header>
    </div>
  );
}

export default App;
