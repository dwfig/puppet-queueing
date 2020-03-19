// Open and connect monitor socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected", socket.id);
});
