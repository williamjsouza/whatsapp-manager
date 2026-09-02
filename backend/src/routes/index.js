const { Router } = require('express');

const authRoutes = require('./auth.routes');
const instancesRoutes = require('./instances.routes');
const webhookRoutes = require('./webhook.routes');
const contactsRoutes = require('./contacts.routes');
const conversationsRoutes = require('./conversations.routes');
const messagesRoutes = require('./messages.routes');
const templatesRoutes = require('./templates.routes');
const scheduledRoutes = require('./scheduled.routes');
const campaignsRoutes = require('./campaigns.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

// Add routes here
router.use('/auth', authRoutes);
router.use('/instances', instancesRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/contacts', contactsRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/messages', messagesRoutes);
router.use('/templates', templatesRoutes);
router.use('/scheduled', scheduledRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'OK' } });
});

module.exports = router;
