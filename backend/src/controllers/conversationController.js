const conversationService = require('../services/conversationService');

class ConversationController {
  async list(req, res, next) {
    try {
      const conversations = await conversationService.listConversations(req.query.instanceId);
      res.json({ success: true, data: conversations });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const conversation = await conversationService.getConversation(req.params.id);
      res.json({ success: true, data: conversation });
    } catch (err) {
      next(err);
    }
  }

  async read(req, res, next) {
    try {
      const result = await conversationService.markAsRead(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConversationController();
