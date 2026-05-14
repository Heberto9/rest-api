const { Router } = require('express');
const router = Router();

const { getIndex, getMarco, getPing } = require('../controllers/index.controller');

router.get('/', getIndex);
router.get('/marco', getMarco);
router.get('/ping', getPing);

module.exports = router;