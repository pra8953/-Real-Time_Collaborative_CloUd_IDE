const router = require("express").Router();
const userRoute = require("./user.routes");
const googleAuthRoute = require("./googleAuth.routes");
const githubAuthRoutes = require("./githubAuth.routes");

router.use("/auth", userRoute);
router.use("/auth", googleAuthRoute);
router.use("/auth", githubAuthRoutes);

module.exports = router;
