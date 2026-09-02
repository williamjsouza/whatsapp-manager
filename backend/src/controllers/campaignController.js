const campaignService = require('../services/campaignService');

class CampaignController {
  async create(req, res, next) {
    try {
      const result = await campaignService.createCampaign(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CampaignController();
