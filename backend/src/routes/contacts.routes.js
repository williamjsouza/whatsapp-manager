const { Router } = require('express');
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', contactController.list);
router.post('/', contactController.create);
router.get('/:id', contactController.get);
router.put('/:id', contactController.update);
router.delete('/:id', contactController.delete);

module.exports = router;
