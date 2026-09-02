const { Router } = require('express');
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', campaignController.create);

module.exports = router;
