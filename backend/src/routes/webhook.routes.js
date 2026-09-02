const { Router } = require('express');
const webhookController = require('../controllers/webhookController');

const router = Router();

// Endpoint configured in Evolution API to send webhooks
router.post('/evolution', webhookController.handleEvolution);

module.exports = router;
