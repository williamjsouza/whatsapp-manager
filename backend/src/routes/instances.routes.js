const { Router } = require('express');
const instanceController = require('../controllers/instanceController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// Protect all instance routes
router.use(authMiddleware);

router.get('/', instanceController.list);
router.post('/', instanceController.create);
router.get('/:id', instanceController.get);
router.post('/:id/connect', instanceController.connect);
router.post('/:id/disconnect', instanceController.disconnect);
router.post('/:id/reconnect', instanceController.reconnect);
router.delete('/:id', instanceController.delete);

module.exports = router;
