const router = require("express").Router();
const authRoutes = require("./auth.routes");
const serviceRoutes = require("./service.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);

module.exports = router;
