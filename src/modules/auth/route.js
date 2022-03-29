const {Router} = require('express');
const {login, whoami} = require("./controller");
const {isAuth} = require("../../middlewares/auth");

const router = Router();

router.post('/login', login);
router.get('/whoami', isAuth, whoami);

module.exports = router;