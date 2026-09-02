const templateService = require('../services/templateService');

class TemplateController {
  async list(req, res, next) {
    try {
      const templates = await templateService.listTemplates();
      res.json({ success: true, data: templates });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const template = await templateService.createTemplate(req.body);
      res.json({ success: true, data: template });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const template = await templateService.updateTemplate(req.params.id, req.body);
      res.json({ success: true, data: template });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await templateService.deleteTemplate(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TemplateController();
