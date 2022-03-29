const {Router} = require('express');
const usersRoutes = require('./modules/users/route');

const router = Router();

router.use('/users', usersRoutes);

module.exports = router;