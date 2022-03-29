const {Router} = require('express');
const {index, store, show} = require("./controller");

const router = Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', store);

module.exports = router;