const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production
    }
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected:', socket.id);
    });
  });

  // Make io globally available if needed
  global.io = io;
};
