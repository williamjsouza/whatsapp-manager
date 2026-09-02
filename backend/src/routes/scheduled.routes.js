const { Router } = require('express');
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', scheduleController.list);
router.post('/', scheduleController.create);
router.put('/:id', scheduleController.update);
router.delete('/:id', scheduleController.delete);
router.post('/:id/cancel', scheduleController.cancel);

module.exports = router;
