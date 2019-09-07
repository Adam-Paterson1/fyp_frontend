import Types from './Types';
// Subscriptions 
// vlx - raw vlx sensor data
// pos - position estimate from backend
// imu - Rotations from pixhawk estimation
//Shape
// listening: {
//   'pos': MAP {
//     'Canvas': setState
//     'Logger': setState
//     'Printer': setState
//   },
//   'vlx',
//   'imu',
// }
let socket = null
let listening = {}
const Socket = {}

Socket.boot = function (ip) {
  ip = ip || 'localhost'
  console.log(`connnecting to ${ip}`)
  socket = new WebSocket(`wss://${ip}:8080`);
  socket.onopen = (event) => {
    console.log('Connected', event);
    const keys = Object.keys(listening)
    keys.forEach((key) => {
      Socket.send({type: 'sub', payload: key})
    })
    Socket.send({type: 'start'})
  };
  // Listen for messages
  socket.onmessage = (event) => {
    // console.log('Message from server ', event);
    const dat = JSON.parse(event.data);
    const formattedData = Types.toType(dat)
    listening[dat.type].forEach((cb) => {
      cb(formattedData);
    })
  }
  socket.onclose = (event) => {
    console.log("WebSocket is closed now.");
  };
}
Socket.send = function (data) {
  if (socket) {
    socket.send(JSON.stringify(data))
  } else {
    console.warn('Socket not ready!')
  }
}
Socket.sub = function (source, dest, cb) {
  if (!listening[source]) {
    listening[source] = new Map()
    Socket.send({type: 'sub', payload: source})
  }
  listening[source].set(dest, cb)
}
Socket.unsub = function (source, dest) {
  if (listening[source]) { // Map exists
    listening[source].delete(dest) // Delete
    if (listening[source].size < 1) { // And potentially unsub
      Socket.send({type: 'unsub', payload: source})
    }
  }
}
Socket.stop = function () {
  Socket.send({type: 'stop'})
}
export default Socket
