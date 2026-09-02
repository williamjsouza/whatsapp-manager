const messageService = require('../services/messageService');

class MessageController {
  async list(req, res, next) {
    try {
      const messages = await messageService.getMessages(req.query.conversationId);
      res.json({ success: true, data: messages });
    } catch (err) {
      next(err);
    }
  }

  async send(req, res, next) {
    try {
      const message = await messageService.sendMessage(req.body);
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }

  async sendMedia(req, res, next) {
    try {
      const message = await messageService.sendMedia(req.body);
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await messageService.deleteMessage(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MessageController();
