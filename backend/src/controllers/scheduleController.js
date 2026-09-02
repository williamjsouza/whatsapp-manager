const scheduleService = require('../services/scheduleService');

class ScheduleController {
  async list(req, res, next) {
    try {
      const scheduled = await scheduleService.listScheduled();
      res.json({ success: true, data: scheduled });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const scheduled = await scheduleService.createScheduled(req.body);
      res.json({ success: true, data: scheduled });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const scheduled = await scheduleService.updateScheduled(req.params.id, req.body);
      res.json({ success: true, data: scheduled });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await scheduleService.deleteScheduled(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const result = await scheduleService.cancelScheduled(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ScheduleController();
