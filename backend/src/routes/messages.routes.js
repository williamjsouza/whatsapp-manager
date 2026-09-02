const { Router } = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', messageController.list);
router.post('/send', messageController.send);
router.post('/media', messageController.sendMedia);
router.delete('/:id', messageController.delete);

module.exports = router;
