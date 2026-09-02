const instanceService = require('../services/instanceService');

class InstanceController {
  async list(req, res, next) {
    try {
      const instances = await instanceService.listInstances();
      res.json({ success: true, data: instances });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const result = await instanceService.createInstance(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const instance = await instanceService.getInstance(req.params.id);
      res.json({ success: true, data: instance });
    } catch (err) {
      next(err);
    }
  }

  async connect(req, res, next) {
    try {
      const result = await instanceService.connectInstance(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async disconnect(req, res, next) {
    try {
      const result = await instanceService.disconnectInstance(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async reconnect(req, res, next) {
    try {
      const result = await instanceService.reconnectInstance(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await instanceService.deleteInstance(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InstanceController();
