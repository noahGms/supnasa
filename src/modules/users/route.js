const { Router } = require("express");
const { index, store, show, update, destroy } = require("./controller");
const { isAuth } = require("../../middlewares/auth");

const router = Router();

router.get("/", isAuth, index);
router.get("/:id", isAuth, show);
router.post("/", store);
router.put("/:id", isAuth, update);
router.delete("/:id", isAuth, destroy);

module.exports = router;
