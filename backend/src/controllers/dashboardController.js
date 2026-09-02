const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getStats(req, res, next) {
    try {
      const stats = await dashboardService.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();
