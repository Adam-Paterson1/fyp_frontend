import React, { useState } from 'react';
import logo from './logo.svg';
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
        <img src={logo} className="App-logo" alt="logo" />
        <input value={ip} onChange={(e) => setIP(e.target.value)} />
        <button onClick={go}>GO!</button>
        <button onClick={Socket.stop}>STOP!</button>

        <Canvas />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
