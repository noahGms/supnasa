const { Router } = require("express");
const usersRoutes = require("./modules/users/route");
const authRoutes = require("./modules/auth/route");
const roversRoutes = require("./modules/rovers/route");
const missionsRoutes = require("./modules/missions/route");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/rovers", roversRoutes);
router.use("/missions", missionsRoutes);

module.exports = router;
