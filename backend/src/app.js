require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const setupWebSocket = require('./websocket');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const startScheduler = require('./jobs/scheduler');
const startBackupJob = require('./jobs/backup');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// Start Schedulers
startScheduler();
startBackupJob();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const path = require('path');
// Serve static frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// API Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

// WebSocket setup
setupWebSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`${process.env.APP_NAME || 'App'} running on port ${PORT}`);
});

module.exports = { app, server };
