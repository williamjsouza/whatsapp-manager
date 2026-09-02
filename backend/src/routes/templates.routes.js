const { Router } = require('express');
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', templateController.list);
router.post('/', templateController.create);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.delete);

module.exports = router;
