const { Router } = require('express');
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', conversationController.list);
router.get('/:id', conversationController.get);
router.post('/:id/read', conversationController.read);

module.exports = router;
