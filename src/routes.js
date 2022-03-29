const {Router} = require('express');
const usersRoutes = require('./modules/users/route');
const authRoutes = require('./modules/auth/route');
const roversRoutes = require('./modules/rovers/route');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/rovers', roversRoutes);

module.exports = router;