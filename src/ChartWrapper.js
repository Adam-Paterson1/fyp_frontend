import React, { useEffect } from 'react';
import Chart from './Chart.js'
import Socket from './Socket';

const listeners = []
function registerInterest(cb, fields) {
  listeners.push({cb:cb, fields: fields})
}
function deregisterInterest(fields) {
  let popIndex = listeners.findIndex((listener) => {return listener.fields = fields})
  listeners.splice(popIndex, 1);
}
const pos = {
  y: 0,
  z: 0
}
function setPos (newData) {
  pos.y = newData.y / 10000
  pos.z = newData.z / 10000
}
function updateCharts(newData) {
  const err = newData.err
  err.ykf = newData.y / 10000
  err.zkf = newData.z / 5000 + 0.04
  err.y = pos.y
  err.z = pos.z
  let newState = {}
  let newList = Object.keys(err);
  newList.forEach((key, index) => {
    newState[key] = {x: new Date(), y:err[key]}
  })
  listeners.forEach((el) => {
    let result = {};
    el.fields.forEach((field) => {
      if (newState[field]) {
        result[field] = newState[field]
      } else {
        result[field] = {x: new Date(), y:0}
      }
    })
    el.cb(result)
  })
}

function ChartWrapper () {
  useEffect(() => {
    Socket.sub('attitude', 'Signals', updateCharts)
    Socket.sub('pos', 'Signals', setPos)
    return function cleanup() {
      Socket.unsub('attitude', 'Signals')
    }
  }, [])
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateCharts({py: 0.2, iy: 0, dy: -0.2, pz: 0.5, iz: Math.round((Math.random()-0.5)*1000)/1000, dz: -0.4})
  //   }, 10);
  //   return () => clearInterval(interval)
  // }, [])
  return (
    <div className="Box">
      <Chart 
        labels={['py', 'iy', 'dy', 'ykf']}
        registerInterest={registerInterest}
        deregisterInterest={deregisterInterest}
        limits={[-3000, 3000]}>
      </Chart>
      <Chart 
        labels={['pz', 'iz', 'dz', 'zkf']}
        registerInterest={registerInterest}
        deregisterInterest={deregisterInterest}
        limits={[-0.08, 0.08]}>
      </Chart>
      {/* <Chart 
        labels={['z', 'zkf']}
        registerInterest={registerInterest}
        deregisterInterest={deregisterInterest}
        limits={[-500, 500]}>
      </Chart> */}
    </div>
  );
}


export default ChartWrapper;
