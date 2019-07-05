// // Create WebSocket connection.
// const socket = new WebSocket('ws://localhost:8080');

// // Connection opened
// socket.onopen = function (event) {
//   console.log('Connected', event);
//   socket.send('Hello Server!');
// };

// // Listen for messages
// socket.onmessage = function (event) {
//   console.log('Message from server ', event.data);
// }

// socket.onclose = function(event) {
//   console.log("WebSocket is closed now.");
// };

const Socket = {
  socket: null,
  boot (ip) {
    ip = ip || 'localhost'
    console.log(`connnecting to ${ip}`)
    this.socket = new WebSocket(`ws://${ip}:8080`);
    this.socket.onopen = function (event) {
      console.log('Connected', event);
      this.socket.send('Hello Server!');
    };
    
    // Listen for messages
    this.socket.onmessage = function (event) {
      console.log('Message from server ', event.data);
    }
    
    this.socket.onclose = function(event) {
      console.log("WebSocket is closed now.");
    };
  }
}

export default Socket