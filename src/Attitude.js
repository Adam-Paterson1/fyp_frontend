import React, { useState, useEffect } from 'react';
import './App.css';
import Socket from './Socket';
import { toDP } from './Utils'

let prevErr = {}

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
      yaw: 0
    },
    err: {
      py: 0,
      iy: 0,
      dy: 0,
      pz: 0,
      iz: 0,
      dz: 0
    }
  })

  useEffect(() => {
    Socket.sub('attitude', 'Attitude', setAttitude)
    return function cleanup() {
      Socket.unsub('attitude', 'Attitude')
    }
  }, [])
  const quality = {
    thrust: getColour(Attitude.target.thrust, Attitude.curr.thrust),
    roll: getColour(Attitude.target.roll, Attitude.curr.roll),
    pitch: getColour(Attitude.target.pitch, Attitude.curr.pitch),
    yaw: getColour(Attitude.target.yaw, 0)
  }
  const err = {
    py: getColour(Attitude.err.py, prevErr.py),
    iy: getColour(Attitude.err.iy, prevErr.iy),
    dy: getColour(Attitude.err.dy, prevErr.dy),
    pz: getColour(Attitude.err.pz, prevErr.pz),
    iz: getColour(Attitude.err.iz, prevErr.iz),
    dz: getColour(Attitude.err.dz, prevErr.dz)
  }
  prevErr = Attitude.err
  const curr = Attitude.curr
  const target = Attitude.target
  return (
    <div className="Attitude">
      <div>Attitude Estimation</div>
      <div className="position">
        <div>Y: {toDP(Attitude.y, 1)}</div>
        <div>Z: {toDP(Attitude.z, 1)}</div>
      </div>
      <div className="ParamTable">
        <div>Param</div>
        <div>Current</div>
        <div>Target</div>
        {Object.keys(quality).map((key) => {
          return <Row key={key} prop={key} curr={curr} target={target} quality={quality} />
        })}
        {Object.keys(err).map((key) => {
          return <ErrRow key={key} prop={key} curr={Attitude.err} quality={err[key]} />
        })}
      </div>
    </div>
  );
}
function getColour(prop1, prop2) {
  if (prop1 > prop2) {
    return 'rgb(0,255,0)'
  } else if (prop1 === prop2) {
    return 'rgb(255,255,255)'
  } else {
    return '#ff4d4d'
  }
}

function Row (props) {
  const {prop, curr, target, quality} = props
  return (
    <>
    <div>{prop.charAt(0).toUpperCase() + prop.slice(1)}</div>
    <div>{curr[prop]}</div>
    <div style={{backgroundColor: quality}}>{target[prop]}</div>
  </>)
}

function ErrRow (props) {
  const {prop, curr, quality} = props

  return (
    <>
    <div>{prop}</div>
    <div style={{backgroundColor: quality}}>{curr[prop]}</div>
    <div></div>
  </>)
}
export default Attitude;


