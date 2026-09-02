const webhookService = require('../services/webhookService');

class WebhookController {
  async handleEvolution(req, res, next) {
    try {
      const { instance, event, data } = req.body;
      
      // We respond immediately to avoid timeouts on Evolution API side
      res.status(200).json({ success: true });

      if (instance && event) {
        // Process asynchronously
        webhookService.processEvent(instance, event, data).catch(err => {
          console.error(`[Webhook] Error processing event ${event} for ${instance}:`, err);
        });
      }
    } catch (err) {
      console.error('[Webhook] Controller error:', err);
    }
  }
}

module.exports = new WebhookController();
