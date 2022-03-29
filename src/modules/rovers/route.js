const {Router} = require('express');
const {index, show, store, update, destroy} = require("./controller");
const {isAuth} = require("../../middlewares/auth");

const router = Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', isAuth, store);
router.put('/:id', isAuth, update);
router.delete('/:id', isAuth, destroy);

module.exports = router;