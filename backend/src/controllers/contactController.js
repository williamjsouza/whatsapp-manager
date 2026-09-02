const contactService = require('../services/contactService');

class ContactController {
  async list(req, res, next) {
    try {
      const contacts = await contactService.listContacts();
      res.json({ success: true, data: contacts });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const contact = await contactService.createContact(req.body);
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const contact = await contactService.getContact(req.params.id);
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const contact = await contactService.updateContact(req.params.id, req.body);
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await contactService.deleteContact(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactController();
