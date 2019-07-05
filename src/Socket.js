const Socket = {
  socket: null,
  boot (ip) {
    ip = ip || 'localhost'
    console.log(`connnecting to ${ip}`)
    this.socket = new WebSocket(`ws://${ip}:8080`);
    this.socket.onopen = (event) => {
      console.log('Connected', event);
      this.socket.send('Hello Server!');
    };
    
    // Listen for messages
    this.socket.onmessage = (event) => {
      console.log('Message from server ', event.data);
    }
    
    this.socket.onclose = (event) => {
      console.log("WebSocket is closed now.");
    };
  }
}

export default Socket